import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { NotificationProcessor } from './notification.processor';
import { SubscribersRepositoryFactory } from '../../repositories/subscriber/repository';
import { Notification } from '../../repositories/subscriber/notification/schema';
import { Payload } from '../../types/global-types';
import { UpdatedModel } from '../../repositories/helper-types';
import { ArchivedNotification } from '../../repositories/subscriber/archived-notification/schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  NotificationArchived,
  NotificationRead,
  NotificationUnarchived,
  NotificationUnread,
  NotificationsRead,
  NotificationsUnread,
} from '../../internal-events/notification';
import { Subject } from '../../repositories/subject/schema';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationProcessor: NotificationProcessor,
    private readonly subscribersRepositoryFactory: SubscribersRepositoryFactory,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getNotifications(
    realm: string,
    subscriberId: string,
    pageNum: number,
    pageSize: number,
  ): Promise<{ notifications: Array<Notification> | undefined, totalCount: number }> {
    const [subscriber] = await this.subscribersRepositoryFactory.create(realm).aggregate([
      { $match: { _id: subscriberId } },
      { $unwind: '$notifications' },
      { $sort: { 'notifications.createdAt': -1 } },
      { $group: { _id: null, totalCount: { $sum: 1 }, notifications: { $push: '$notifications' } } },
      { $project: { _id: 0, totalCount: 1, notifications: { $slice: ['$notifications', (pageNum - 1) * pageSize, pageSize] } } },
    ]);

    return { notifications: subscriber?.notifications, totalCount: subscriber?.totalCount }
  }

  async countUnread(realm: string, subscriberId: string) : Promise<number> {

    return this.subscribersRepositoryFactory.create(realm)
        .aggregate([
          { $match: { _id: subscriberId } },
          {
            $project: {
              unreadNotifications: {
                $filter: {
                  input: '$notifications',
                  as: 'notification',
                  cond: { $eq: ['$$notification.read', false] }
                }
              }
            }
          },
          {
            $project: {
              count: { $size: '$unreadNotifications' }
            }
          }
        ]).then(aggregationResult => {
          const countResult: any = aggregationResult[0];
           return countResult?.count ?? 0;
        });        
  }

  async getArchivedNotifications(
    realm: string,
    subscriberId: string,
    pageNum: number,
    pageSize: number,
  ): Promise<{ archivedNotifications: Array<ArchivedNotification> | undefined, totalCount: number}> {
    const [subscriber] = await this.subscribersRepositoryFactory.create(realm).aggregate([
      { $match: { _id: subscriberId } },
      { $unwind: '$archivedNotifications' },
      { $sort: { 'archivedNotifications.archivedAt': -1 } },
      { $group: { _id: null, totalCount: { $sum: 1 }, archivedNotifications: { $push: '$archivedNotifications' } } },
      { $project: { _id: 0, totalCount: 1, archivedNotifications: { $slice: ['$archivedNotifications', (pageNum - 1) * pageSize, pageSize] } } },
    ]);

    return { archivedNotifications: subscriber?.archivedNotifications, totalCount: subscriber?.totalCount }
  }

  async archive(realm: string, subscriberId: string, notificationsIds: Array<string>): Promise<UpdatedModel> {
    const result = await this.subscribersRepositoryFactory
      .create(realm)
      .aggregate([
        {
          $match: { _id: subscriberId },
        },
        {
          $project: {
            notifications: {
              $filter: {
                input: '$notifications',
                as: 'notification',
                cond: {
                  $in: ['$$notification._id', notificationsIds.map((oid) => new Types.ObjectId(oid))],
                },
              },
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            id: { $first: '$_id' },
            notifications: { $push: '$notifications' },
          },
        },
      ])
      .then((aggregationResult) => {
        const notificationsToArchive = {
          $reduce: {
            input: aggregationResult[0].notifications,
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] },
          },
        };
        return this.subscribersRepositoryFactory.create(realm).updateOne(
          { _id: subscriberId },
          [
            {
              $set: {
                archivedNotifications: {
                  $cond: {
                    if: { $eq: ['$archivedNotifications', null] },
                    then: {
                      $map: {
                        input: notificationsToArchive,
                        in: { $mergeObjects: ['$$this', { archivedAt: new Date() }] },
                      },
                    },
                    else: {
                      $concatArrays: [
                        '$archivedNotifications',
                        {
                          $map: {
                            input: notificationsToArchive,
                            in: { $mergeObjects: ['$$this', { archivedAt: new Date() }] },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              $set: {
                notifications: {
                  $filter: {
                    input: '$notifications',
                    as: 'notification',
                    cond: {
                      $not: {
                        $in: ['$$notification._id', notificationsIds.map((oid) => new Types.ObjectId(oid))],
                      },
                    },
                  },
                },
              },
            },
          ],
          { setDefaultsOnInsert: true },
        );
      });

    this.eventEmitter.emit('notification.archived', new NotificationArchived(subscriberId, notificationsIds));

    return result;
  }

  async unarchive(realm: string, subscriberId: string, archivedNotificationsIds: Array<string>): Promise<UpdatedModel> {
    const result = await this.subscribersRepositoryFactory
      .create(realm)
      .aggregate([
        {
          $match: { _id: subscriberId },
        },
        {
          $project: {
            archivedNotifications: {
              $filter: {
                input: '$archivedNotifications',
                as: 'archivedNotification',
                cond: {
                  $in: ['$$archivedNotification._id', archivedNotificationsIds.map((oid) => new Types.ObjectId(oid))],
                },
              },
            },
          },
        },
        {
          $unset: ['archivedNotifications.archivedAt'],
        },
        {
          $group: {
            _id: '$_id',
            id: { $first: '$_id' },
            archivedNotifications: { $push: '$archivedNotifications' },
          },
        },
      ])
      .then((aggregationResult) => {
        const notificationsToUnarchive = {
          $reduce: {
            input: aggregationResult[0].archivedNotifications,
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] },
          },
        };
        return this.subscribersRepositoryFactory.create(realm).updateOne({ _id: subscriberId }, [
          {
            $set: {
              archivedNotifications: {
                $filter: {
                  input: '$archivedNotifications',
                  as: 'archivedNotification',
                  cond: {
                    $not: {
                      $in: [
                        '$$archivedNotification._id',
                        archivedNotificationsIds.map((oid) => new Types.ObjectId(oid)),
                      ],
                    },
                  },
                },
              },
            },
          },
          {
            $set: {
              notifications: {
                $concatArrays: [
                  '$notifications',
                  {
                    $map: {
                      input: notificationsToUnarchive,
                      as: 'notification',
                      in: '$$notification',
                    },
                  },
                ],
              },
            },
          },
        ]);
      });

    this.eventEmitter.emit(
      'notification.unarchived',
      new NotificationUnarchived(subscriberId, archivedNotificationsIds),
    );

    return result;
  }

  buildNotification(subject: Subject, topicId: string, titleTemplate: string, messageTemplate: string, actionUrl: string, payload: Payload): Notification {
    const title: string = this.compileContent(titleTemplate, payload);
    const message: string = this.compileContent(messageTemplate, payload);
    return this.notificationProcessor.build(subject, topicId, title, message, actionUrl);
  }

  compileContent(template: string | undefined, payload: Payload): string {
    return this.notificationProcessor.compileContent(template, payload);
  }

  async notify(realm: string, subscriberId: string, notification: Notification) {
    await this.subscribersRepositoryFactory
      .create(realm)
      .updateOne(
        { _id: subscriberId },
        { $push: { notifications: notification } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
  }

  async notifyAll(realm: string, subscribersIds: Array<string>, notification: Notification) {
    await this.subscribersRepositoryFactory.create(realm).bulkWrite(
      subscribersIds.map((subscriberId) => {
        return {
          updateOne: {
            filter: { _id: subscriberId },
            update: {
              $push: { notifications: notification },
              $setOnInsert: { _id: subscriberId },
            },
            upsert: true,
          },
        };
      }),
    );
  }

  async markAsRead(realm: string, subscriberId: string, notificationId: string) {
    await this.subscribersRepositoryFactory
      .create(realm)
      .updateOne(
        { _id: subscriberId, 'notifications._id': notificationId },
        { $set: { 'notifications.$[notification].read': true } },
        { arrayFilters: [{ 'notification._id': notificationId }] },
      );

    this.eventEmitter.emit('notification.read', new NotificationRead(subscriberId, [notificationId]));
  }

  async markManyAsRead(realm: string, subscriberId: string, notificationsIds: Array<string>) {
    await this.subscribersRepositoryFactory
      .create(realm)
      .updateOne(
        { _id: subscriberId, 'notifications._id': { $in: notificationsIds} },
        { $set: { 'notifications.$[notification].read': true } },
        { arrayFilters: [{ 'notification._id': { $in: notificationsIds} }] },
      );

    this.eventEmitter.emit('notification.read', new NotificationRead(subscriberId, notificationsIds));
  }

  async markAllAsRead(realm: string, subscriberId: string) {
    await this.subscribersRepositoryFactory
      .create(realm)
      .updateOne({ _id: subscriberId }, { $set: { 'notifications.$[].read': true } });

    this.eventEmitter.emit('notifications.read', new NotificationsRead(subscriberId));
  }

  async markAsUnread(realm: string, subscriberId: string, notificationId: string) {
    await this.subscribersRepositoryFactory
      .create(realm)
      .updateOne(
        { _id: subscriberId, 'notifications._id': notificationId },
        { $set: { 'notifications.$[notification].read': false } },
        { arrayFilters: [{ 'notification._id': notificationId }] },
      );

    this.eventEmitter.emit('notification.unread', new NotificationUnread(subscriberId, [notificationId]));
  }

  async markManyAsUnread(realm: string, subscriberId: string, notificationsIds: Array<string>) {
    await this.subscribersRepositoryFactory
      .create(realm)
      .updateOne(
        { _id: subscriberId, 'notifications._id': { $in: notificationsIds } },
        { $set: { 'notifications.$[notification].read': false } },
        { arrayFilters: [{ 'notification._id': { $in: notificationsIds } }] },
      );

    this.eventEmitter.emit('notification.unread', new NotificationUnread(subscriberId, notificationsIds));
  }

  async markAllAsUnread(realm: string, subscriberId: string) {
    await this.subscribersRepositoryFactory
      .create(realm)
      .updateOne({ _id: subscriberId }, { $set: { 'notifications.$[].read': false } });

    this.eventEmitter.emit('notifications.unread', new NotificationsUnread(subscriberId));
  }
}
