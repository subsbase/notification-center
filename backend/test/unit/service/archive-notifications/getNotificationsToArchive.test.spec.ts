import { createMock } from '@golevelup/ts-jest';
import { ArchivedNotificationsGlobalRepository } from '../../../../src/repositories/archived-notifications/global-repositorty';
import { SubscribersGlobalRepository } from '../../../../src/repositories/subscriber/global-repository';
import { Types } from 'mongoose';
import { BulkWriteResult } from 'mongodb';
import { ArchiveNotificationService } from '../../../../src/services/archived-notifications/archive.notifications.service';
import { Topic } from '../../../../src/repositories/topic/schema';
import { InvalidArgumentError } from '../../../../src/types/exceptions';
import { ArchivedNotificationProcessor } from '../../../../src/services/archived-notifications/archived.notification.processor';
import { Subscriber } from '../../../../src/repositories/subscriber/schema';
import { ArchivedNotification } from '../../../../src/repositories/subscriber/archived-notification/schema';

describe('ArchiveNotificationService - getNotificationsToArchive', () => {
  let service: ArchiveNotificationService;
  let archivedNotificationsRepository: ArchivedNotificationsGlobalRepository;
  let subscribersGlobalRepository: SubscribersGlobalRepository;
  let archivedNotificationProcessor: ArchivedNotificationProcessor;
  beforeEach(() => {
    archivedNotificationsRepository = createMock<ArchivedNotificationsGlobalRepository>();
    subscribersGlobalRepository = createMock<SubscribersGlobalRepository>();
    archivedNotificationProcessor = new ArchivedNotificationProcessor()

    service = new ArchiveNotificationService(archivedNotificationProcessor ,archivedNotificationsRepository, subscribersGlobalRepository);
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
    const notification: ArchivedNotification = new ArchivedNotification()
    notification.id='6457a58fc3efba97726d7e99'
    notification.content='test-notification'
    notification.topic=new Topic()
    notification.archivedAt=new Date(Date.now() - (thresholdDays + 1) * 24 * 60 * 60 * 1000)
    notification.read=false
    notification.actionUrl='google.com'
    notification.createdAt=new Date()
    notification.updatedAt=new Date()
    
    const notificationsToArchive: Array<ArchivedNotification> = [notification];

    const subscriber: Subscriber = new Subscriber()    
    subscriber.id= subscriberId
    subscriber.createdAt = new Date()
    subscriber.updatedAt= new Date()
    subscriber.realm = realm 
    subscriber.notifications = []
    subscriber.archivedNotifications = notificationsToArchive
    

    const bulkWriteResult: BulkWriteResult = createMock<BulkWriteResult>();
    // Create a mock subscribersGlobalRepository that returns the mock subscriber
    jest.spyOn(subscribersGlobalRepository, 'aggregate').mockResolvedValueOnce([subscriber]);
    jest.spyOn(subscribersGlobalRepository, 'bulkWrite').mockResolvedValueOnce(bulkWriteResult);

    // Call the service method
    const result = await service.getNotificationsToArchive(thresholdDays);

    // Assert the result
    expect(result).toEqual([subscriber]);

    expect(subscribersGlobalRepository.bulkWrite).toBeCalledWith([
      {
        updateOne: {
          filter: {
            _id: subscriber.id,
          },
          update: {
            $pull: {
              archivedNotifications: {
                _id: {
                  $in: notificationsToArchive.map((n) => new Types.ObjectId(n.id)),
                },
              },
            },
          },
        },
      },
    ]);
  });
});
