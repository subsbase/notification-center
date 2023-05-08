import { ArchiveNotificationService } from '../../../../src/services/archived-notifications/archive-notifications.service';
import { ArchivedNotificationsGlobalRepository } from '../.../../../../../src/repositories/archived-notifications/global-repositorty';
import { SubscribersGlobalRepository } from '../../../../src/repositories/subscriber/global-repository';
import { createMock } from '@golevelup/ts-jest';
import { Topic } from '../../../../src/repositories/topic/schema';
import { ArchivedNotification as SubscriberArchivedNotification } from '../../../../src/repositories/subscriber/archived-notification/schema';

describe('ArchiveNotificationService - archive', () => {
  let service: ArchiveNotificationService;
  let archivedNotificationsRepository: ArchivedNotificationsGlobalRepository;
  let subscribersGlobalRepository: SubscribersGlobalRepository;

  beforeEach(() => {
    archivedNotificationsRepository = createMock<ArchivedNotificationsGlobalRepository>();
    subscribersGlobalRepository = createMock<SubscribersGlobalRepository>();
    service = new ArchiveNotificationService(archivedNotificationsRepository, subscribersGlobalRepository);
  });

  it('should not insert any notifications if subscribers list is empty', async () => {
    const subscribers = new Array<{
      subscriberId: string;
      realm: string;
      notificationsToArchive: Array<SubscriberArchivedNotification> | undefined;
    }>();
    await service.archive(subscribers);
    expect(archivedNotificationsRepository.insertMany).toHaveBeenCalledWith([], { ordered: false });
  });

  it('should insert notifications into archived notifications repository for all subscribers', async () => {
    const notification = {
      _id: '6457a58fc3efba97726d7e99',
      content: 'test-notification',
      topic: new Topic(),
      archivedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      payload: { test: 'payload' },
      read: false,
      actionUrl: 'google.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const subscribers = [
      {
        subscriberId: '123',
        realm: 'realm1',
        notificationsToArchive: [notification, notification],
      },
      {
        subscriberId: '456',
        realm: 'realm2',
        notificationsToArchive: [notification],
      },
    ];
    const expectedNotifications = [
      {
        subscriberId: '123',
        realm: 'realm1',
        _id: notification._id,
        content: notification.content,
        topic: notification.topic,
        archivedAt: notification.archivedAt,
        payload: notification.payload,
        read: notification.read,
        actionUrl: notification.actionUrl,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      },
      {
        subscriberId: '123',
        realm: 'realm1',
        _id: notification._id,
        content: notification.content,
        topic: notification.topic,
        archivedAt: notification.archivedAt,
        payload: notification.payload,
        read: notification.read,
        actionUrl: notification.actionUrl,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      },
      {
        subscriberId: '456',
        realm: 'realm2',
        _id: notification._id,
        content: notification.content,
        topic: notification.topic,
        archivedAt: notification.archivedAt,
        payload: notification.payload,
        read: notification.read,
        actionUrl: notification.actionUrl,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      },
    ];
    await service.archive(subscribers);
    expect(archivedNotificationsRepository.insertMany).toHaveBeenCalledWith(expectedNotifications, { ordered: false });
  });

  it('should insert notifications only for subscribers that have notifications to archive', async () => {
    const notification = {
      _id: '6457a58fc3efba97726d7e99',
      content: 'test-notification',
      topic: new Topic(),
      archivedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      payload: { test: 'payload' },
      read: false,
      actionUrl: 'google.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const subscribers = [
      {
        subscriberId: '6457a58fc3efba97726d7e99',
        realm: 'realm1',
        notificationsToArchive: [],
      },
      {
        subscriberId: '6457a58fc3efba97726d7e99',
        realm: 'realm2',
        notificationsToArchive: [notification],
      },
    ];
    await service.archive(subscribers);
    expect(archivedNotificationsRepository.insertMany).toHaveBeenCalledWith(
      [
        {
          subscriberId: '6457a58fc3efba97726d7e99',
          realm: 'realm2',
          ...notification,
        },
      ],
      { ordered: false },
    );
  });
});
