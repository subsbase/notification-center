import { createMock } from '@golevelup/ts-jest';
import { ArchivedNotificationsGlobalRepository } from '../../../../src/repositories/archived-notifications/global-repositorty';
import { SubscribersGlobalRepository } from '../../../../src/repositories/subscriber/global-repository';
import { Types } from 'mongoose';
import { BulkWriteResult } from 'mongodb';
import { ArchiveNotificationService } from '../../../../src/services/archived-notifications/archive-notifications.service';
import { Topic } from '../../../../src/repositories/topic/schema';
import { InvalidArgumentError } from '../../../../src/types/exceptions';

describe('ArchiveNotificationService - getNotificationsToArchive', () => {
  let service: ArchiveNotificationService;
  let archivedNotificationsRepository: ArchivedNotificationsGlobalRepository;
  let subscribersGlobalRepository: SubscribersGlobalRepository;

  beforeEach(() => {
    archivedNotificationsRepository = createMock<ArchivedNotificationsGlobalRepository>();
    subscribersGlobalRepository = createMock<SubscribersGlobalRepository>();

    service = new ArchiveNotificationService(archivedNotificationsRepository, subscribersGlobalRepository);
  });

  it('should return empty array if there are no notifications to archive', async () => {
    jest.spyOn(subscribersGlobalRepository, 'aggregate').mockResolvedValueOnce([]);
    const result = await service.getNotificationsToArchive(30);
    expect(result).toEqual([]);
  });

  it('should throw an error when thresholdDays is not valid', async () => {
    try{
      await service.getNotificationsToArchive(-1)
    }catch(err){
      expect(err).toBeInstanceOf(InvalidArgumentError);
    }

    expect(subscribersGlobalRepository.aggregate).not.toHaveBeenCalled()
  });

  it('should retrieve notifications to archive', async () => {
    // Define the threshold days
    const thresholdDays = 30;

    // Create a mock subscriber with notifications to archive
    const subscriberId = '6457a58fc3efba97726d7e99';
    const realm = 'test-realm';
    const notification = {
      _id: '6457a58fc3efba97726d7e99',
      content: 'test-notification',
      topic: new Topic(),
      archivedAt: new Date(Date.now() - (thresholdDays + 1) * 24 * 60 * 60 * 1000),
      payload: { test: 'payload' },
      read: false,
      actionUrl: 'google.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const notificationsToArchive = [notification];
    const subscriber = {
      _id: subscriberId,
      subscriberId: subscriberId,
      createdAt: new Date(),
      updatedAt: new Date(),
      realm,
      notifications: [],
      archivedNotifications: notificationsToArchive,
    };

    const bulkWriteResult: BulkWriteResult = createMock<BulkWriteResult>();
    // Create a mock subscribersGlobalRepository that returns the mock subscriber
    jest.spyOn(subscribersGlobalRepository, 'aggregate').mockResolvedValueOnce([subscriber]);
    jest.spyOn(subscribersGlobalRepository, 'bulkWrite').mockResolvedValueOnce(bulkWriteResult);

    // Call the service method
    const result = await service.getNotificationsToArchive(thresholdDays);

    // Assert the result
    expect(result).toEqual([
      {
        subscriberId,
        realm,
        notificationsToArchive,
      },
    ]);

    expect(subscribersGlobalRepository.bulkWrite).toBeCalledWith([
      {
        updateOne: {
          filter: {
            _id: subscriber._id,
          },
          update: {
            $pull: {
              archivedNotifications: {
                _id: {
                  $in: notificationsToArchive.map((n) => new Types.ObjectId(n._id)),
                },
              },
            },
          },
        },
      },
    ]);
  });
});
