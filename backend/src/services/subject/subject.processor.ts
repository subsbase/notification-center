import { InvalidArgumentError } from '../../types/exceptions';
import { StringUtilts } from '../../utils/string-utils';

export class SubjectProcessor {
  getTitleFormKey(subjectKey: string) {
    return StringUtilts.kebabToNormal(subjectKey);
  }

  validateSubjectKey(subjectKey: string): void {
    if (this.isNotValidSubjectKey(subjectKey)) {
      throw new InvalidArgumentError(
        'subject',
        `Invalid subject key ${subjectKey} subject key must be provided in kebab-case`,
      );
    }
  }

  private isNotValidSubjectKey(subjectKey: string): boolean {
    return !StringUtilts.isKebabCase(subjectKey);
  }
}
