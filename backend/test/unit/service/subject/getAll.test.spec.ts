import { createMock } from '@golevelup/ts-jest';
import { Subject } from '../../../../src/repositories/subject/schema';
import { SubjectsRepository, SubjectsRepositoryFactory } from '../../../../src/repositories/subject/repository';
import { SubjectService } from '../../../../src/services/subject/subject.service';
import { SubjectProcessor } from '../../../../src/services/subject/subject.processor';

describe('SubjectService.getAll', () => {
  it('should return an array of Subject objects', async () => {
    // Arrange
    const realm = 'test-realm';
    const pageSize = 10;
    const pageNum = 1;
    const mockSubjectsRepository = createMock<SubjectsRepository>({
      find: jest.fn().mockResolvedValue([new Subject(), new Subject()]),
    });
    const mockSubjectsRepositoryFactory = createMock<SubjectsRepositoryFactory>({
      create: jest.fn().mockReturnValue(mockSubjectsRepository),
    });

    const subjectProcessor = new SubjectProcessor();
    const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepositoryFactory);

    // Act
    const result = await subjectService.getAll(realm, pageNum, pageSize);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBeInstanceOf(Subject);
    expect(result[1]).toBeInstanceOf(Subject);
  });

  it('should skip the correct number of records based on the page number and page size', async () => {
    // Arrange
    const realm = 'test-realm';
    const pageSize = 10;
    const pageNum = 2;
    const mockSubjectsRepository = createMock<SubjectsRepository>({
      find: jest.fn().mockResolvedValue(Array.from({ length: 20 }, () => new Subject())),
    });
    const mockSubjectsRepositoryFactory = createMock<SubjectsRepositoryFactory>({
      create: jest.fn().mockReturnValueOnce(mockSubjectsRepository),
    });
    const subjectProcessor = new SubjectProcessor();
    const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepositoryFactory);

    // Act
    await subjectService.getAll(realm, pageNum, pageSize);

    // Assert
    expect(mockSubjectsRepository.find).toHaveBeenCalledWith({}, {}, { skip: 10, limit: 10 });
  });

  it('should limit the number of records returned based on the page size', async () => {
    // Arrange
    const realm = 'test-realm';
    const pageSize = 10;
    const pageNum = 1;
    const mockSubjectsRepository = createMock<SubjectsRepository>({
      find: jest.fn().mockResolvedValue(Array.from({ length: 20 }, () => new Subject())),
    });
    const mockSubjectsRepositoryFactory = createMock<SubjectsRepositoryFactory>({
      create: jest.fn().mockReturnValue(mockSubjectsRepository),
    });
    const subjectProcessor = new SubjectProcessor();
    const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepositoryFactory);

    // Act
    await subjectService.getAll(realm, pageNum, pageSize);

    // Assert
    expect(mockSubjectsRepository.find).toHaveBeenCalledWith({}, {}, { skip: 0, limit: 10 });
  });

  it('should throw an error if the repository returns an error', async () => {
    // Arrange
    const realm = 'test-realm';
    const pageSize = 10;
    const pageNum = 1;
    const mockError = new Error('Repository error');
    const mockSubjectsRepository = createMock<SubjectsRepository>({
      find: jest.fn().mockRejectedValue(mockError),
    });
    const mockSubjectsRepositoryFactory = createMock<SubjectsRepositoryFactory>({
      create: jest.fn().mockReturnValue(mockSubjectsRepository),
    });
    const subjectProcessor = new SubjectProcessor();
    const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepositoryFactory);

    // Act
    const resultPromise = subjectService.getAll(realm, pageNum, pageSize);

    // Assert
    await expect(resultPromise).rejects.toThrow(mockError);
  });
});
