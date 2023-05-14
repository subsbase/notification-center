import { SubjectManager } from '../../../../src/managers/subject/subject.manager';
import { SubjectService } from '../../../../src/services/subject/subject.service';
import { Subject } from '../../../../src/repositories/subject/schema';
import { createMock } from '@golevelup/ts-jest';

describe('SubjectManager getAll', () => {
  let subjectManager: SubjectManager;
  let subjectService: SubjectService;

  beforeEach(async () => {
    subjectService = createMock<SubjectService>();
    subjectManager = new SubjectManager(subjectService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call subjectService.getAll with a pageNum and pageSize of 0', async () => {
    const realm = 'test-realm';
    const pageNum = 0;
    const pageSize = 0;

    jest.spyOn(subjectService, 'getAll').mockResolvedValue([]);

    const result = await subjectManager.getAll(realm, pageNum, pageSize);

    expect(result).toEqual([]);
    expect(subjectService.getAll).toHaveBeenCalledWith(realm, pageNum, pageSize);
  });

  it('should call subjectService.getAll with a pageNum value greater than the total number of pages available', async () => {
    const realm = 'test-realm';
    const pageNum = 100;
    const pageSize = 10;

    jest.spyOn(subjectService, 'getAll').mockResolvedValue([]);

    const result = await subjectManager.getAll(realm, pageNum, pageSize);

    expect(result).toEqual([]);
    expect(subjectService.getAll).toHaveBeenCalledWith(realm, pageNum, pageSize);
  });

  it('should call subjectService.getAll with a pageSize value greater than the total number of items available', async () => {
    const realm = 'test-realm';
    const pageNum = 1;
    const pageSize = 100;

    const expected = [new Subject(), new Subject()];
    jest.spyOn(subjectService, 'getAll').mockResolvedValue(expected);

    const result = await subjectManager.getAll(realm, pageNum, pageSize);

    expect(result).toEqual(expected);
    expect(subjectService.getAll).toHaveBeenCalledWith(realm, pageNum, pageSize);
  });

  it('should call subjectService.getAll with a pageNum value less than 1', async () => {
    const realm = 'test-realm';
    const pageNum = -1;
    const pageSize = 10;

    jest.spyOn(subjectService, 'getAll').mockResolvedValue([]);

    const result = await subjectManager.getAll(realm, pageNum, pageSize);

    expect(result).toEqual([]);
    expect(subjectService.getAll).toHaveBeenCalledWith(realm, pageNum, pageSize);
  });

  it('should call subjectService.getAll with a pageSize value less than 1', async () => {
    const realm = 'test-realm';
    const pageNum = 1;
    const pageSize = -10;

    jest.spyOn(subjectService, 'getAll').mockResolvedValue([]);

    const result = await subjectManager.getAll(realm, pageNum, pageSize);

    expect(result).toEqual([]);
    expect(subjectService.getAll).toHaveBeenCalledWith(realm, pageNum, pageSize);
  });
});
