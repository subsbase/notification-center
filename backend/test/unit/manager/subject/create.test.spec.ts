import { SubjectManager } from '../../../../src/managers/subject/subject.manager';
import { SubjectService } from '../../../../src/services/subject/subject.service';
import { Subject } from '../../../../src/repositories/subject/schema';
import { createMock } from '@golevelup/ts-jest';
import { MongooseError } from 'mongoose';

describe('SubjectManager create', () => {
  let subjectManager: SubjectManager;
  let subjectService: SubjectService;

  beforeEach(async () => {
    subjectService = createMock<SubjectService>();
    subjectManager = new SubjectManager(subjectService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call subjectService.create with the provided subject', async () => {
    const expected = { id: '123', created: true };
    const subject = new Subject();
    subject.id = 'Invoice';

    jest.spyOn(subjectService, 'create').mockResolvedValue(expected);

    const result = await subjectManager.create(subject);

    expect(subjectService.create).toHaveBeenCalledWith(subject);
  });

  it('should throw an error if subjectService.create throws an error', async () => {
    const subject = new Subject();
    subject.id = 'Invoice';

    jest.spyOn(subjectService, 'create').mockImplementation((subject) => {
      throw new MongooseError('Error');
    });

    expect(subjectManager.create(subject)).rejects.toThrowError(MongooseError);
  });
});
