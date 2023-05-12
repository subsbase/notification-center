import { ArchiveNotificationService } from '../../../../src/services/archived-notifications/archive.notifications.service';
import { ArchivedNotificationsGlobalRepository } from '../.../../../../../src/repositories/archived-notifications/global-repositorty';
import { SubscribersGlobalRepository } from '../../../../src/repositories/subscriber/global-repository';
import { createMock } from '@golevelup/ts-jest';
import { Topic } from '../../../../src/repositories/topic/schema';
import { Subscriber } from '../../../../src/repositories/subscriber/schema';
import { ArchivedNotificationProcessor } from '../../../../src/services/archived-notifications/archived.notification.processor';
import { ArchivedNotification as  SubscriberArchivedNotification } from '../../../../src/repositories/subscriber/archived-notification/schema';
import { ArchivedNotification } from '../../../../src/repositories/archived-notifications/schema';

describe('ArchiveNotificationService - archive', () => {
  let service: ArchiveNotificationService;
  let archivedNotificationsRepository: ArchivedNotificationsGlobalRepository;
  let subscribersGlobalRepository: SubscribersGlobalRepository;
  let archivedNotificationProcessor: ArchivedNotificationProcessor;

  beforeEach(() => {
    archivedNotificationsRepository = createMock<ArchivedNotificationsGlobalRepository>();
    subscribersGlobalRepository = createMock<SubscribersGlobalRepository>();
    archivedNotificationProcessor = new ArchivedNotificationProcessor();
    
    service = new ArchiveNotificationService(archivedNotificationProcessor, archivedNotificationsRepository, subscribersGlobalRepository);
  });

  it('should not insert any notifications if subscribers list is empty', async () => {
    const subscribers = new Array<Subscriber>();
    await service.archive(subscribers);
    expect(archivedNotificationsRepository.insertMany).toHaveBeenCalledWith([], { ordered: false });
  });

  it('should insert notifications into archived notifications repository for all subscribers', async () => {
    
    const subscribers: Array<Subscriber> = getSubscribers()

    const expectedNotifications: Array<ArchivedNotification> = getArchivedNotification()

    await service.archive(subscribers);
    expect(archivedNotificationsRepository.insertMany).toHaveBeenCalledWith(expectedNotifications, { ordered: false });
  });

  it('should insert notifications only for subscribers that have notifications to archive', async () => {
    const notification: SubscriberArchivedNotification = new SubscriberArchivedNotification();
    notification.id='6457a58fc3efba97726d7e99';
    notification.content= 'test-notification';
    notification.topic= new Topic();
    notification.archivedAt= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    notification.read= false;
    notification.actionUrl= 'google.com';
    notification.createdAt= new Date();
    notification.updatedAt= new Date();

    const subscriber1: Subscriber = new Subscriber();
    subscriber1.id='6457a58fc3efba97726d7e99'
    subscriber1.realm= 'realm1'
    subscriber1.createdAt= expect.any(Date)
    subscriber1.updatedAt= expect.any(Date)
    subscriber1.notifications= []
    subscriber1.archivedNotifications= []

    const subscriber2: Subscriber = new Subscriber();
    subscriber2.id='6457a58fc3efba97726d7e99'
    subscriber2.realm= 'realm2'
    subscriber2.createdAt= expect.any(Date)
    subscriber2.updatedAt= expect.any(Date)
    subscriber2.notifications= []
    subscriber2.archivedNotifications= [notification]

    const subscribers: Array<Subscriber> = [
      subscriber1,
      subscriber2,
    ];

    const subscriber: Subscriber = new Subscriber();
    subscriber.id='6457a58fc3efba97726d7e99'
    subscriber.realm= 'realm2'
    subscriber.createdAt= expect.any(Date)
    subscriber.updatedAt= expect.any(Date)
    subscriber.notifications= []
    subscriber.archivedNotifications= [notification]

    const expected: ArchivedNotification = new ArchivedNotification()
    expected.subscriber = subscriber
    expected.realm = 'realm2'
    expected.actionUrl = notification.actionUrl
    expected.archivedAt = notification.archivedAt
    expected.content = notification.content
    expected.createdAt = notification.createdAt
    expected.id = notification.id
    expected.read = notification.read
    expected.topic = new Topic()
    expected.updatedAt = notification.updatedAt

    await service.archive(subscribers);
    expect(archivedNotificationsRepository.insertMany).toHaveBeenCalledWith(
              [expected]
            , { ordered: false }
    );
  });

  function getSubscriberArchivedNotification() : SubscriberArchivedNotification {
    const subscriberArchivedNotification: SubscriberArchivedNotification = new SubscriberArchivedNotification()
    subscriberArchivedNotification.id='6457a58fc3efba97726d7e99'
    subscriberArchivedNotification.content= 'test-notification'
    subscriberArchivedNotification.topic= new Topic()
    subscriberArchivedNotification.archivedAt= expect.any(Date)
    subscriberArchivedNotification.read= false
    subscriberArchivedNotification.actionUrl= 'google.com'
    subscriberArchivedNotification.createdAt= expect.any(Date)
    subscriberArchivedNotification.updatedAt = expect.any(Date)

    return subscriberArchivedNotification;
  }

  function getSubscribers(): Array<Subscriber> {
    const notification = getSubscriberArchivedNotification()

    const subscriber1: Subscriber = new Subscriber();
    subscriber1.id='123';
    subscriber1.realm ='realm1';
    subscriber1.createdAt= expect.any(Date);
    subscriber1.updatedAt=  expect.any(Date);
    subscriber1.notifications=[];
    subscriber1.archivedNotifications=[notification, notification];

    const subscriber2: Subscriber = new Subscriber()
    subscriber2.id='456'
    subscriber2.realm='realm2'
    subscriber2.createdAt=expect.any(Date)
    subscriber2.updatedAt=expect.any(Date)
    subscriber2.notifications=[]
    subscriber2.archivedNotifications=[notification]

    return new Array<Subscriber>(subscriber1, subscriber2)
  }

  function getArchivedNotification() : Array<ArchivedNotification>{

    const subscribers = getSubscribers()
    const subscriber1 = subscribers[0];
    const subscriber2 = subscribers[1];

    const notification = getSubscriberArchivedNotification()

    const notification1: ArchivedNotification = new ArchivedNotification();
    notification1.subscriber=subscriber1
    notification1.realm = subscriber1.realm
    notification1.id = notification.id 
    notification1.content = notification.content 
    notification1.topic = notification.topic 
    notification1.archivedAt=  notification.archivedAt 
    notification1.read = notification.read 
    notification1.actionUrl = notification.actionUrl 
    notification1.createdAt = expect.any(Date)
    notification1.updatedAt = expect.any(Date)

    const notification2: ArchivedNotification = new ArchivedNotification();
    notification2.subscriber = subscriber1
    notification2.realm = subscriber1.realm
    notification2.id = notification.id
    notification2.content = notification.content 
    notification2.topic = notification.topic 
    notification2.archivedAt = notification.archivedAt 
    notification2.read = notification.read 
    notification2.actionUrl = notification.actionUrl 
    notification2.createdAt = expect.any(Date) 
    notification2.updatedAt = expect.any(Date)

    const notification3: ArchivedNotification = new ArchivedNotification();
    notification3.subscriber = subscriber2 
    notification3.realm=  subscriber2.realm 
    notification3.id = notification.id 
    notification3.content = notification.content 
    notification3.topic = notification.topic 
    notification3.archivedAt = notification.archivedAt 
    notification3.read = notification.read 
    notification3.actionUrl = notification.actionUrl 
    notification3.createdAt = expect.any(Date) 
    notification3.updatedAt = expect.any(Date) 

    return new Array<ArchivedNotification>(notification1, notification2, notification3)
  }
});
