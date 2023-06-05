import { Injectable } from '@nestjs/common';
import { ArchivedNotificationsGlobalRepository } from '../../repositories/archived-notifications/global-repositorty';
import { SubscribersGlobalRepository } from '../../repositories/subscriber/global-repository';
import { Types } from 'mongoose';
import { Subscriber } from '../../repositories/subscriber/schema';
import { ArchivedNotificationProcessor } from './archived.notification.processor';
import { ValidationUtils } from '../../utils/validation-utils';

@Injectable()
export class ArchiveNotificationService {
  constructor(
    private readonly archivedNotificationProcessor: ArchivedNotificationProcessor,
    private readonly archivedNotificationsRepository: ArchivedNotificationsGlobalRepository,
    private readonly subscribersGlobalRepository: SubscribersGlobalRepository,
  ) {}

  getNotificationsToArchive(thresholdDays: number): Promise<Array<Subscriber>> {
    //validate thresholdDays to make sure it is correct number
    ValidationUtils.validateNaturalNumber(thresholdDays, 'thresholdDays');

    return this.subscribersGlobalRepository
      .aggregate([
        { $unwind: '$archivedNotifications' },
        {
          $match: {
            'archivedNotifications.archivedAt': { $lt: new Date(Date.now() - thresholdDays * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: '$_id',
            id: { $first: '$_id' },
            realm: { $first: '$realm' },
            archivedNotifications: { $push: '$archivedNotifications' },
          },
        },
      ])
      .then((aggregationResult) => {
        this.subscribersGlobalRepository.bulkWrite(
          aggregationResult.map((subscriber) => ({
            updateOne: {
              filter: { _id: subscriber.id },
              update: {
                $pull: {
                  archivedNotifications: {
                    _id: {
                      $in: subscriber.archivedNotifications?.map(
                        (archivedNotification) => new Types.ObjectId(archivedNotification.id),
                      ),
                    },
                  },
                },
              },
            },
          })),
        );

        return aggregationResult;
      });
  }

  async archive(subscribers: Array<Subscriber>): Promise<void> {
    await this.archivedNotificationsRepository.insertMany(
      subscribers.flatMap((subscriber) => this.archivedNotificationProcessor.buildFromSubscriber(subscriber)),
      { ordered: false },
    );
  }
}
