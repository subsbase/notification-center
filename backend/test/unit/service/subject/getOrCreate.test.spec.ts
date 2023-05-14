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
    const subjectKey = 'invoice';
    const existingSubject = new Subject();
    existingSubject.id = subjectKey;
    const mockSubjectsRepository = createMock<SubjectsRepository>({
      findOrCreate: jest.fn().mockResolvedValue(existingSubject),
    });
    const mockSubjectsRepositoryFactory = createMock<SubjectsRepositoryFactory>({
      create: jest.fn().mockReturnValueOnce(mockSubjectsRepository),
    });

    const subjectProcessor = new SubjectProcessor();
    const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepositoryFactory);
    // Act
    const result = await subjectService.getOrCreate(realm, subjectKey);

    // Assert
    expect(result).toBe(existingSubject);
  });

  it('should throw error if findOrCreate throws error', async () => {
    // Arrange
    const realm = 'test-realm';
    const subjectKey = 'invoice';
    const existingSubject = new Subject();
    existingSubject.id = subjectKey;
    const mockSubjectsRepository = createMock<SubjectsRepository>();
    const mockSubjectsRepositoryFactory = createMock<SubjectsRepositoryFactory>({
      create: jest.fn().mockReturnValueOnce(mockSubjectsRepository),
    });
    const subjectProcessor = new SubjectProcessor();
    const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepositoryFactory);

    jest.spyOn(mockSubjectsRepository, 'findOrCreate').mockRejectedValue(new MongoServerError({}));

    // Assert
    await expect(subjectService.getOrCreate(realm, subjectKey)).rejects.toThrowError(MongoError);
    expect(mockSubjectsRepository.findOrCreate).toHaveBeenCalledWith({ id: subjectKey, title: 'Invoice' });
  });

  it('should throw error if invalid subject key', async () => {
    // Arrange
    const realm = 'test-realm';
    const subjectKey = 'INVOICE';
    const existingSubject = new Subject();
    existingSubject.id = subjectKey;
    const mockSubjectsRepository = createMock<SubjectsRepository>();
    const mockSubjectsRepositoryFactory = createMock<SubjectsRepositoryFactory>({
      create: jest.fn().mockResolvedValue(mockSubjectsRepository),
    });
    const subjectProcessor = new SubjectProcessor();
    const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepositoryFactory);

    try {
      //Act
      await subjectService.getOrCreate(realm, subjectKey);
    } catch (err) {
      // Assert
      expect(err).toBeInstanceOf(InvalidArgumentError);
    }
    expect(mockSubjectsRepository.findOrCreate).not.toHaveBeenCalled();
  });
});
