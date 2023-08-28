import { Agenda, Job } from '@hokify/agenda';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Types } from 'mongoose';
import { MongoErrorFilter } from 'src/filters/mongo-error.filter';
import { NotificationSnoozed } from 'src/internal-events/notification';
import { OperationResult } from 'src/repositories/helper-types';
import { SubscribersRepositoryFactory } from 'src/repositories/subscriber/repository';

@Injectable()
export class SnoozeNotificationsService {
  constructor(
    private readonly subscribersRepositoryFactory: SubscribersRepositoryFactory,
    private readonly agenda: Agenda,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async snoozeNotifications(
    realm: string,
    subscriberId: string,
    notificationsIds: Array<string>,
    snoozeUntil: Date,
  ): Promise<OperationResult> {
    const res = await this.subscribersRepositoryFactory
      .create(realm)
      .aggregate([
        {
          $match: { _id: subscriberId },
        },
        {
          $project: {
            realm: '$realm',
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
            realm: { $first: '$realm' },
            notifications: { $push: '$notifications' },
          },
        },
      ])
      .then(async (aggregationResult) => {
        var notificationsToSnooze = aggregationResult[0]?.notifications;

        if (!notificationsToSnooze) {
          return { success: false, message: 'no notification found with provided ids' };
        }

        // notificationsToSnooze.forEach(notification => {
        //   await this.agenda
        //     .create('unsnooze', {
        //       realm: realm,
        //       subscriberId: subscriberId,
        //       notifications: notification,
        //     })
        //     .schedule(snoozeUntil)
        //     .save();
        // });
        notificationsToSnooze = notificationsToSnooze.flat();

        for (let i = 0; i < notificationsToSnooze.length; i++) {
          await this.agenda
            .create('unsnooze', {
              realm: realm,
              subscriberId: subscriberId,
              notification: notificationsToSnooze[i],
            })
            .schedule(snoozeUntil)
            .save();
        }

        await this.subscribersRepositoryFactory.create(realm).updateOne(
          { _id: subscriberId },
          [
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
    this.eventEmitter.emit('notification.snoozed', new NotificationSnoozed(subscriberId, notificationsIds));
    return {
      success: true,
      message: 'notifications snoozed successfully',
    };
  }
}
