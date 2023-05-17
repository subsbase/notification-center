import { StringUtilts } from '../../utils/string-utils';
import { NotificationTemplate } from '../../repositories/topic/notification-template/schema';
import { Topic } from '../../repositories/topic/schema';
import { ValidationUtils } from '../../utils/validation-utils';

export class TopicProcessor {
  validateId(id: string, propertyName: string) {
    ValidationUtils.validateStringId(id, propertyName);
  }
    }
  }

  getTopicNameFormId(id: string): string {
    return StringUtilts.kebabToNormal(id);
  }
}
