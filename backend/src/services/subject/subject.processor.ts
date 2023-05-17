import { ValidationUtils } from '../../utils/validation-utils';
import { StringUtilts } from '../../utils/string-utils';

export class SubjectProcessor {
  getTitleFormId(subjectKey: string) {
    return StringUtilts.kebabToNormal(subjectKey);
  }

  validateSubjectId(subjectId: string): void {
    ValidationUtils.validateStringId(subjectId, 'subject.id');
  }
}
