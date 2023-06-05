import { createMock } from '@golevelup/ts-jest';
import { Subject } from '../../../../src/repositories/subject/schema';
import { SubjectsRepository, SubjectsRepositoryFactory } from '../../../../src/repositories/subject/repository';
import { SubjectService } from '../../../../src/services/subject/subject.service';
import { MongoServerError, MongoError } from 'mongoose/node_modules/mongodb';
import { SubjectProcessor } from '../../../../src/services/subject/subject.processor';
import { InvalidArgumentError } from '../../../../src/types/exceptions';

describe('SubjectService.getOrCreate', () => {
  it('should return an Subject object', async () => {
    // Arrange
    const realm = 'test-realm';
    const subjectId = 'invoice';
    const existingSubject = new Subject();
    existingSubject.id = subjectId;
    const mockSubjectsRepository = createMock<SubjectsRepository>({
      findOrCreateById: jest.fn().mockResolvedValue(existingSubject),
    });
    const mockSubjectsRepositoryFactory = createMock<SubjectsRepositoryFactory>({
      create: jest.fn().mockReturnValueOnce(mockSubjectsRepository),
    });

    const subjectProcessor = new SubjectProcessor();
    const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepositoryFactory);
    // Act
    const result = await subjectService.getOrCreate(realm, subjectId);

    // Assert
    expect(result).toBe(existingSubject);
  });

  it('should throw error if findOrCreate throws error', async () => {
    // Arrange
    const realm = 'test-realm';
    const subjectId = 'invoice';
    const existingSubject = new Subject();
    existingSubject.id = subjectId;
    const mockSubjectsRepository = createMock<SubjectsRepository>();
    const mockSubjectsRepositoryFactory = createMock<SubjectsRepositoryFactory>({
      create: jest.fn().mockReturnValueOnce(mockSubjectsRepository),
    });
    const subjectProcessor = new SubjectProcessor();
    const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepositoryFactory);

    jest.spyOn(mockSubjectsRepository, 'findOrCreateById').mockRejectedValue(new MongoServerError({}));

    // Assert
    await expect(subjectService.getOrCreate(realm, subjectId)).rejects.toThrowError(MongoError);
    expect(mockSubjectsRepository.findOrCreateById).toHaveBeenCalledWith(subjectId, { _id: subjectId, name: 'Invoice' });
  });

  it('should throw error if invalid subject key', async () => {
    // Arrange
    const realm = 'test-realm';
    const subjectId = 'INVOICE';
    const existingSubject = new Subject();
    existingSubject.id = subjectId;
    const mockSubjectsRepository = createMock<SubjectsRepository>();
    const mockSubjectsRepositoryFactory = createMock<SubjectsRepositoryFactory>({
      create: jest.fn().mockResolvedValue(mockSubjectsRepository),
    });
    const subjectProcessor = new SubjectProcessor();
    const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepositoryFactory);

    try {
      //Act
      await subjectService.getOrCreate(realm, subjectId);
    } catch (err) {
      // Assert
      expect(err).toBeInstanceOf(InvalidArgumentError);
    }
    expect(mockSubjectsRepository.findOrCreateById).not.toHaveBeenCalled();
  });
});
