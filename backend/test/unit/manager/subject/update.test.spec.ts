import { SubjectManager } from '../../../../src/managers/subject/subject.manager';
import { SubjectService } from '../../../../src/services/subject/subject.service';
import { Subject } from '../../../../src/repositories/subject/schema';
import { createMock } from '@golevelup/ts-jest';
import { MongooseError } from 'mongoose';

describe('SubjectManager update', () => {
  let subjectManager: SubjectManager;
  let subjectService: SubjectService;

  beforeEach(async () => {
    subjectService = createMock<SubjectService>();
    subjectManager = new SubjectManager(subjectService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call subjectService.update with the provided subject', async () => {
    const expected = {
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
      matchedCount: 1,
      acknowledged: true,
    };
    const subject = new Subject();
    subject._id = '123';
    subject.key = 'Invoice';

    jest.spyOn(subjectService, 'update').mockResolvedValue(expected);

    const result = await subjectManager.update(subject);

    expect(result).toEqual(expected);
    expect(subjectService.update).toHaveBeenCalledWith(subject);
  });

  it('should throw an error if subjectService.update throws an error', async () => {
    const subject = new Subject();
    jest.spyOn(subjectService, 'update').mockImplementation((subject) => {
      throw new MongooseError('Error');
    });

    expect(subjectManager.update(subject)).rejects.toThrowError(MongooseError);
    expect(subjectService.update).toHaveBeenCalledWith(subject);
  });

  it('should set the return modifiedCount and matchedCount with 0 of the returned object', async () => {
    const expected = {
      modifiedCount: 0,
      upsertedCount: 0,
      upsertedId: null,
      matchedCount: 0,
      acknowledged: true,
    };
    const subject = new Subject();
    subject._id = '123';
    subject.key = 'Invoice';

    jest.spyOn(subjectService, 'update').mockResolvedValue(expected);

    const result = await subjectManager.update(subject);

    expect(result).toEqual(expected);
    expect(result.matchedCount).toEqual(result.modifiedCount);
    expect(subjectService.update).toHaveBeenCalledWith(subject);
  });
});
