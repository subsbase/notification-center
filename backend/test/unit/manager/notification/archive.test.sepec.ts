import { createMock } from '@golevelup/ts-jest';
import { NotificationManager } from '../../../../src/managers/notification/notification.manager';
import { NotificationService } from '../../../../src/services/notification/notification.service';
import { EventsGateway } from '../../../../src/events/events.gateway';
import { TopicService } from '../../../../src/services/topic/topic.service';
import { SubjectService } from '../../../../src/services/subject/subject.service';

describe('NotificationManager archive', () => {
  it('should call notificationService.archive with the correct parameters', async () => {
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
    const result = await notificationManager.archive(realm, subscriberId, notificationsIds);

    // Assert
    expect(mockedNotificationService.archive).toHaveBeenCalledWith(subscriberId, notificationsIds);
  });

  it('should return result of notification service archive method', async () => {
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

    mockedNotificationService.archive.mockResolvedValue(mockResult);

    //Act
    const result = await notificationManager.archive(realm, subscriberId, notificationsIds);

    //Assert
    expect(result).toEqual(mockResult);
  });
});
