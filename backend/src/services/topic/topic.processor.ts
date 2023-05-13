import { StringUtilts } from '../../utils/string-utils';
import { InvalidArgumentError } from '../../types/exceptions';

export class TopicProcessor {
  validateId(id: string): void {
    if (this.isNotValidTopicId(id)) {
      throw new InvalidArgumentError('event', `Invalid topic event ${id} event must be provided in kebab-case`);
    }
  }

  getTopicNameFormId(id: string): string {
    return StringUtilts.kebabToNormal(id);
  }

  private isNotValidTopicId(id: string): boolean {
    return !StringUtilts.isKebabCase(id);
  }
}
