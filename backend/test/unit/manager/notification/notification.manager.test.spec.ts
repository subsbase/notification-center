import { createMock } from '@golevelup/ts-jest'
import { Notification } from '../../../../src/repositories/subscriber/notification/schema'
import { NotificationManager } from '../../../../src/managers/notification/notification.manager'
import { TopicService } from '../../../../src/services/topic/topic.service'
import { NotificationService } from '../../../../src/services/notification/notification.service'
import { NotFoundException } from '@nestjs/common'
import { EventsGateway } from 'src/events/events.gateway'


describe('test notificationManager.getAllNotifications', () => {

    const notifications = createMock<Array<Notification>>()

    test.each([
        { subscriberId: '3030', pageNum: 1 , pageSize: 2 , returnedNotifications: notifications , expectedResult: notifications },
        { subscriberId: '5050', pageNum: 1 , pageSize: 2 , returnedNotifications: null , expectedResult: new Array() },
    ])('test when getAllNotifications returns $returnedNotifications result should be $expectedResult ', async ({ subscriberId, pageNum, pageSize, returnedNotifications, expectedResult }) => {

        //Arrange
        const mockedTopicsService = createMock<TopicService>();
        const mockedNotificationService = createMock<NotificationService>({ getNotifications: jest.fn().mockImplementation(() => {
            return returnedNotifications;
          })
        })
        const mockedEventsGateway = createMock<EventsGateway>()
        const notificationManager = new NotificationManager(mockedEventsGateway,mockedNotificationService, mockedTopicsService);
        
        //Act
        const result = await notificationManager.getAllNotifications(subscriberId, pageNum, pageSize);

        //Assert
        expect(result).toStrictEqual(expectedResult);
    })
})

describe('test notificationManager.notify', () => {

    test.each([
        { event: 'undefinedEvent', actionUrl: '', subscribersIds: ['','']  , topic: undefined },
        { event: 'nullEvent', actionUrl: '',subscribersIds: ['',''] , topic: null }
    ])('when topic is $topic throws Exception', ({ event, actionUrl, subscribersIds, topic }) => {
      
        //Arrange
        const mockedTopicsService = createMock<TopicService>({ getByEvent: jest.fn().mockImplementation(() => {
            return topic;
        }) });
        const mockedNotificationService = createMock<NotificationService>()
        const mockedEventsGateway = createMock<EventsGateway>()
        const notificationManager = new NotificationManager(mockedEventsGateway,mockedNotificationService, mockedTopicsService);
        
        //Act
        const promisResult = notificationManager.notify(event, actionUrl, null, subscribersIds)

        //Assert
        promisResult.catch((error) => {
            expect(error).toBeInstanceOf(NotFoundException)
        })
    })
})
