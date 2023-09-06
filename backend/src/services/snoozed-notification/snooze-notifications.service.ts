import { Agenda } from '@hokify/agenda';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Types } from 'mongoose';
import { NotificationSnoozed } from '../../internal-events/notification';
import { OperationResult } from '../../repositories/helper-types';
import { SubscribersRepositoryFactory } from '../../repositories/subscriber/repository';

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
    return this.subscribersRepositoryFactory
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
      .then((aggregationResult) => {
        var notificationsToSnooze = aggregationResult[0]?.notifications?.flat();

        if (!notificationsToSnooze || notificationsToSnooze.length == 0) {
          return { success: false, message: 'no notification found with provided ids' };
        }

        notificationsToSnooze.forEach(async (notification) => {
          await this.agenda
            .create('unsnooze', {
              realm: realm,
              subscriberId: subscriberId,
              notification: notification,
            })
            .schedule(snoozeUntil)
            .save();
        });

        return this.subscribersRepositoryFactory
          .create(realm)
          .updateOne(
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
          )
          .then((updateResult) => {
            if (!updateResult || updateResult.modifiedCount == 0) {
              return { success: false, message: 'unable to snooze' };
            }

            this.eventEmitter.emit('notification.snoozed', new NotificationSnoozed(subscriberId, notificationsIds));
            return { success: true, message: 'notifications snoozed successfully' };
          });
      });
  }
}
