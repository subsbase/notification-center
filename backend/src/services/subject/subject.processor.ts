import { ValidationUtils } from '../../utils/validation-utils';
import { StringUtilts } from '../../utils/string-utils';
import { Subject } from '../../repositories/subject/schema';
import { Topic } from '../../repositories/subject/topic/schema';

export class SubjectProcessor {
  getNameFormId(subjectId: string) : string {
    return StringUtilts.kebabToNormal(subjectId);
  }

  buildSubjectWithEmptyTopics(receivedSubject: Subject): Subject {
    const subject: Subject = new Subject()
    subject.id = receivedSubject.id
    subject.name = receivedSubject.name
    subject.topics = new Map<string, Topic>() 
    return subject;
  }

  validateSubjectId(subjectId: string): void {
    ValidationUtils.validateStringId(subjectId, 'subject.id');
  }
}
