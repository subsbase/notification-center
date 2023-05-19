import Handlebars from 'handlebars';
import { Payload } from '../../types/global-types';
import { Notification } from '../../repositories/subscriber/notification/schema';
import { InvalidArgumentError } from '../../types/exceptions';
import { StringUtilts } from '../../utils/string-utils';
import { ValidationUtils } from '../../utils/validation-utils';
import { Subject } from '../../repositories/subject/schema';

export class NotificationProcessor {
  build(subject: Subject, topicId: string ,title: string, message: string, actionUrl: string): Notification {
    if (subject == null || subject == undefined) {
      throw new InvalidArgumentError('topic');
    }

    ValidationUtils.validateString(title, 'title');
    ValidationUtils.validateString(message, 'message');
    
    let notification = new Notification();

    notification.subject = subject;
    notification.topicId = topicId
    notification.actionUrl = actionUrl;
    notification.title = title;
    notification.message = message;

    return notification;
  }

  compileContent(template: string | undefined, payload: Payload): string {
    return StringUtilts.isString(payload) ? payload.toString() : Handlebars.compile(template)(payload);
  }
}
