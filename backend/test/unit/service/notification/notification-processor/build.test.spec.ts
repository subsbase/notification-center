import { Subject } from '../../../../../src/repositories/subject/schema';
import { Topic } from '../../../../../src/repositories/topic/schema';
import { NotificationProcessor } from '../../../../../src/services/notification/notification.processor';
import { Notification } from '../../../../../src/repositories/subscriber/notification/schema';

describe('build', () => {
  let notificationProcessor: NotificationProcessor;

  beforeEach(() => {
    notificationProcessor = new NotificationProcessor();
  });

  it('should build a notification object with the correct values', () => {
    const topic: Topic = new Topic();
    topic.id = 'test-topic';
    topic.name = 'Test Topic';
    topic.subject = new Subject();
    topic.realm = 'admin-portal';
    topic.createdAt = new Date();
    topic.updatedAt = new Date();

    const content = 'Test content';
    const actionUrl = 'https://example.com';

    const expectedNotification: Notification = new Notification();
    expectedNotification.id = undefined as unknown as string;
    expectedNotification.topic = topic;
    expectedNotification.content = content;
    expectedNotification.actionUrl = actionUrl;
    expectedNotification.createdAt = undefined as unknown as Date;
    expectedNotification.updatedAt = undefined as unknown as Date;
    expectedNotification.read = undefined as unknown as boolean;

    const notification = notificationProcessor.build(topic, content, actionUrl);

    expect(notification).toEqual(expectedNotification);
  });

  it('should throw an error when topic is null', () => {
    const content = 'Test content';
    const actionUrl = 'https://example.com';
    const topic = null as unknown as Topic;
    //topic is required
    expect(() => notificationProcessor.build(topic, content, actionUrl)).toThrowError();
  });

  it('should throw an error when content is empty', () => {
    const topic: Topic = new Topic();
    topic.id = 'test-topic';
    topic.name = 'Test Topic';
    topic.subject = new Subject();
    topic.realm = 'admin-portal';
    topic.createdAt = new Date();
    topic.updatedAt = new Date();

    const content = '';
    const actionUrl = 'https://example.com';

    //content is required
    expect(() => notificationProcessor.build(topic, content, actionUrl)).toThrowError();
  });

  it('should build normaly when actionUrl is empty', () => {
    const topic: Topic = new Topic();
    topic.id = 'test-topic';
    topic.name = 'Test Topic';
    topic.subject = new Subject();
    topic.realm = 'admin-portal';
    topic.createdAt = new Date();
    topic.updatedAt = new Date();

    const content = 'Test content';
    const actionUrl = '';

    const expectedNotification: Notification = new Notification();
    expectedNotification.id = undefined as unknown as string;
    expectedNotification.topic = topic;
    expectedNotification.content = content;
    expectedNotification.actionUrl = actionUrl;
    expectedNotification.createdAt = undefined as unknown as Date;
    expectedNotification.updatedAt = undefined as unknown as Date;
    expectedNotification.read = undefined as unknown as boolean;

    //content is required
    const notification = notificationProcessor.build(topic, content, actionUrl);

    expect(notification).toEqual(expectedNotification);
  });
});
