import { Subject } from '../../../../../src/repositories/subject/schema';
import { Topic } from '../../../../../src/repositories/subject/topic/schema';
import { NotificationProcessor } from '../../../../../src/services/notification/notification.processor';
import { Notification } from '../../../../../src/repositories/subscriber/notification/schema';
import { title } from 'process';

describe('build', () => {
  let notificationProcessor: NotificationProcessor;

  beforeAll(() => {
    notificationProcessor = new NotificationProcessor();
  });

  it('should throw an error if subject is null', () => {
    expect(() => {
      notificationProcessor.build(null as unknown as Subject, 'topicId', 'Title', 'Message', 'actionUrl');
    }).toThrow();
  });

  it('should throw an error if subject is undefined', () => {
    expect(() => {
      notificationProcessor.build(undefined as unknown as Subject, 'topicId', 'Title', 'Message', 'actionUrl');
    }).toThrow();
  });

  it('should throw an error if title is not a string', () => {
    const subject: Subject = new Subject()
    subject.id = 'test-subject-id'
    const title: any = Math.random()
    expect(() => {
      notificationProcessor.build(subject, 'topicId', title, 'Message', 'actionUrl');
    }).toThrow();
  });

  it('should throw an error if message is not a string', () => {
    const subject: Subject = new Subject()
    subject.id = 'test-subject-id'
    const message: any = Math.random()
    expect(() => {
      notificationProcessor.build(subject, 'topicId', 'Title', message, 'actionUrl');
    }).toThrow();
  });

  it('should throw an error if actionUrl is not a string', () => {
    const subject: Subject = new Subject()
    subject.id = 'test-subject-id'
    const actionUrl: string = 'invalid-url'
    expect(() => {
      notificationProcessor.build(subject, 'topic-id', 'title', 'message', actionUrl);
    }).toThrow();
  });

  it('should return a notification object with the correct properties', () => {
    const subject: Subject = new Subject();
    subject.id = 'test-subject-id'
    const topicId = 'topicId';
    const title = 'Title';
    const message = 'Message';
    const actionUrl = 'http://test.com';

    const notification = notificationProcessor.build(subject, topicId, title, message, actionUrl);

    expect(notification.subject).toEqual(subject);
    expect(notification.topicId).toEqual(topicId);
    expect(notification.title).toEqual(title);
    expect(notification.message).toEqual(message);
    expect(notification.actionUrl).toEqual(actionUrl);
  }); 
});
