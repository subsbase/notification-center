import { createMock } from '@golevelup/ts-jest';
import { NotificationManager } from '../../../../src/managers/notification/notification.manager';
import { NotificationService } from '../../../../src/services/notification/notification.service';
import { EventsGateway } from '../../../../src/events/events.gateway';
import { TopicService } from '../../../../src/services/topic/topic.service';
import { SubjectService } from '../../../../src/services/subject/subject.service';
import { Notification } from '../../../../src/repositories/subscriber/notification/schema';

describe('NotificationManager getAllNotifications', () => {
  it('should call notification service getNotifications method with subscriberId, pageNum and pageSize', async () => {
    //Arrange
    const mockedNotificationService = createMock<NotificationService>();
    const mockedEventGateway = createMock<EventsGateway>();
    const mockedTopicsService = createMock<TopicService>();
    const mockedSubjectService = createMock<SubjectService>();
    const notificationManager = new NotificationManager(
      mockedEventGateway,
      mockedNotificationService,
      mockedTopicsService,
      mockedSubjectService,
    );
    const realm = 'test-realm';
    const subscriberId = '123';
    const pageNum = 1;
    const pageSize = 10;

    await notificationManager.getAllNotifications(realm, subscriberId, pageNum, pageSize);

    expect(mockedNotificationService.getNotifications).toHaveBeenCalledWith(realm, subscriberId, pageNum, pageSize);
  });

  it('should return empty array if notifications are null', async () => {
    const mockedNotificationService = createMock<NotificationService>();
    const mockedEventGateway = createMock<EventsGateway>();
    const mockedTopicsService = createMock<TopicService>();
    const mockedSubjectService = createMock<SubjectService>();
    const notificationManager = new NotificationManager(
      mockedEventGateway,
      mockedNotificationService,
      mockedTopicsService,
      mockedSubjectService,
    );

    jest.spyOn(mockedNotificationService, 'getNotifications').mockResolvedValue(undefined);
    const result = await notificationManager.getAllNotifications('test-realm', '123', 1, 10);
    expect(result).toEqual([]);
  });

  it('should return notifications array if notifications are not null', async () => {
    const mockedNotificationService = createMock<NotificationService>();
    const mockedEventGateway = createMock<EventsGateway>();
    const mockedTopicsService = createMock<TopicService>();
    const mockedSubjectService = createMock<SubjectService>();
    const notificationManager = new NotificationManager(
      mockedEventGateway,
      mockedNotificationService,
      mockedTopicsService,
      mockedSubjectService,
    );
    const notification = new Notification();
    const notifications = [];
    for (let i = 0; i < 10; i++) {
      notifications.push(notification);
    }
    jest.spyOn(mockedNotificationService, 'getNotifications').mockResolvedValue(notifications);
    const result = await notificationManager.getAllNotifications('test-realm', '123', 1, 10);
    expect(result).toEqual(notifications);
  });
});
