import { createMock } from '@golevelup/ts-jest';
import { NotificationManager } from '../../../../src/managers/notification/notification.manager';
import { NotificationService } from '../../../../src/services/notification/notification.service';
import { EventsGateway } from '../../../../src/events/events.gateway';
import { TopicService } from '../../../../src/services/topic/topic.service';
import { SubjectService } from '../../../../src/services/subject/subject.service';

describe('NotificationManager unarchive', () => {
  it('should call notificationService.unarchive with the correct parameters', async () => {
    // Arrange
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
    const notificationsIds = ['1', '2'];

    // Act
    const result = await notificationManager.unarchive(realm, subscriberId, notificationsIds);

    // Assert
    expect(mockedNotificationService.unarchive).toHaveBeenCalledWith(realm, subscriberId, notificationsIds);
  });

  it('should return result of notification service unarchive method', async () => {
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
    const notificationsIds = ['1', '2'];
    const mockResult = {
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
      matchedCount: 1,
      acknowledged: true,
    };

    mockedNotificationService.unarchive.mockResolvedValue(mockResult);

    //Act
    const result = await notificationManager.unarchive(realm, subscriberId, notificationsIds);

    //Assert
    expect(result).toEqual(mockResult);
  });
});
