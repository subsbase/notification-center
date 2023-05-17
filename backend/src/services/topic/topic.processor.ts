import { StringUtilts } from '../../utils/string-utils';
import { NotificationTemplate } from '../../repositories/topic/notification-template/schema';
import { Topic } from '../../repositories/topic/schema';
import { ValidationUtils } from '../../utils/validation-utils';

export class TopicProcessor {
  validateId(id: string, propertyName: string) {
    ValidationUtils.validateStringId(id, propertyName);
  }

  tryGetNotificationTemplate(
    templateId: string,
    recivedNotificationTemplate: NotificationTemplate,
    topic: Topic,
  ): [string | undefined, boolean, Topic] {
    let template: string | undefined;
    let needTopicUpdate: boolean = false;

    const notificationTemplates = topic.notificationTemplates ?? new Map<string, NotificationTemplate>();

    if (recivedNotificationTemplate) {
      this.validateId(templateId, 'templateId');
      notificationTemplates.set(templateId, recivedNotificationTemplate);
      topic.notificationTemplates = notificationTemplates;
      needTopicUpdate = true;
      template = recivedNotificationTemplate.template!;
    } else if (templateId) {
      template = notificationTemplates.get(templateId)?.template;
    } else {
      template = notificationTemplates.values().next()?.value?.template;
    }
    return [template, needTopicUpdate, topic];
  }

  getTopicNameFormId(id: string): string {
    return StringUtilts.kebabToNormal(id);
  }
}
