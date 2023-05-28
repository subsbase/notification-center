import { NotificationTemplate } from '../../repositories/subject/topic/notification-template/schema';
import { Topic } from '../../repositories/subject/topic/schema';
import { ValidationUtils } from '../../utils/validation-utils';

export class TopicProcessor {
  validateId(id: string, propertyName: string) {
    ValidationUtils.validateStringId(id, propertyName);
  }

  buildEmptyTopic(id: string): Topic {
    const topic = new Topic()
    topic.id = id
    topic.notificationTemplates = new Map<string, NotificationTemplate>()
    return topic;
  }

  buildNotificationTemplate(id: string,titleTemplate: string, messageTemplate: string) : NotificationTemplate {
    const notificationTemplate: NotificationTemplate = new NotificationTemplate()
    notificationTemplate.id = id
    notificationTemplate.title = titleTemplate
    notificationTemplate.message = messageTemplate
    return notificationTemplate;
  }

  tryGetNotificationTemplate(topic: Topic, templateId: string, title: string, message: string): [string,string] {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(topic?.notificationTemplates, templateId)
    const template: NotificationTemplate = propertyDescriptor?.value
    const titleTemplate: string = title ?? template?.title;
    const messageTemplate: string = message ?? template?.message;

    return [titleTemplate, messageTemplate]
  }
}
