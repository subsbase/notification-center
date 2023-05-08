import { createMock } from '@golevelup/ts-jest';
import { Subject } from '../../../../src/repositories/subject/schema';
import { SubjectsRepository } from '../../../../src/repositories/subject/repository';
import { SubjectService } from '../../../../src/services/subject/subject.service';
import { MongoServerError, MongoError } from 'mongodb';


describe('SubjectService.getOrCreate', () => {

    it('should return an Subject object', async () => {
      // Arrange
      const subjectName = 'Math';
      const existingSubject = new Subject();
      existingSubject.name = subjectName;
      const mockSubjectsRepository = createMock<SubjectsRepository>({
        findOrCreate: jest.fn().mockResolvedValue(existingSubject),
      });
      const subjectService = new SubjectService(mockSubjectsRepository);
  
      // Act
      const result = await subjectService.getOrCreate(subjectName);
  
      // Assert
      expect(result).toBe(existingSubject);
    })

    it('should throw error if token is empty', async () => {
      // Arrange
      const subjectName = 'Math';
      const existingSubject = new Subject();
      existingSubject.name = subjectName;
      const mockSubjectsRepository = createMock<SubjectsRepository>();
      const subjectSerice = new SubjectService(mockSubjectsRepository);

      jest.spyOn(mockSubjectsRepository, 'findOrCreate').mockRejectedValue(new MongoServerError({}));
  
      // Assert
      await expect(subjectSerice.getOrCreate(subjectName)).rejects.toThrowError(MongoError);
      expect(mockSubjectsRepository.findOrCreate).toHaveBeenCalledWith({ name: subjectName });
    });

});