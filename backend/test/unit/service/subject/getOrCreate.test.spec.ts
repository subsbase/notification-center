import { createMock } from '@golevelup/ts-jest';
import { Subject } from '../../../../src/repositories/subject/schema';
import { SubjectsRepository } from '../../../../src/repositories/subject/repository';
import { SubjectService } from '../../../../src/services/subject/subject.service';
import { MongoServerError, MongoError } from 'mongodb';
import { SubjectProcessor } from '../../../../src/services/subject/subject.processor';
import { InvalidArgumentError } from '../../../../src/types/exceptions';


describe('SubjectService.getOrCreate', () => {

    it('should return an Subject object', async () => {
      // Arrange
      const subjectKey = 'invoice';
      const existingSubject = new Subject();
      existingSubject.id = subjectKey;
      const mockSubjectsRepository = createMock<SubjectsRepository>({
        findOrCreate: jest.fn().mockResolvedValue(existingSubject),
      });
      const subjectProcessor = new SubjectProcessor();
      const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepository);  
      // Act
      const result = await subjectService.getOrCreate(subjectKey);
  
      // Assert
      expect(result).toBe(existingSubject);
    })

    it('should throw error if findOrCreate throws error', async () => {
      // Arrange
      const subjectKey = 'invoice';
      const existingSubject = new Subject();
      existingSubject.id = subjectKey;
      const mockSubjectsRepository = createMock<SubjectsRepository>();
      const subjectProcessor = new SubjectProcessor();
      const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepository);
      
      jest.spyOn(mockSubjectsRepository, 'findOrCreate').mockRejectedValue(new MongoServerError({}));
  
      // Assert
      await expect(subjectService.getOrCreate(subjectKey)).rejects.toThrowError(MongoError);
      expect(mockSubjectsRepository.findOrCreate).toHaveBeenCalledWith({ id: subjectKey, title: 'Invoice' });
    });

    it('should throw error if invalid subject key', async () => {
      // Arrange
      const subjectKey = 'INVOICE';
      const existingSubject = new Subject();
      existingSubject.id = subjectKey;
      const mockSubjectsRepository = createMock<SubjectsRepository>();
      const subjectProcessor = new SubjectProcessor();
      const subjectService = new SubjectService(subjectProcessor, mockSubjectsRepository);
        
      try{
        
        //Act
        await subjectService.getOrCreate(subjectKey)

      }catch(err){
        // Assert
        expect(err).toBeInstanceOf(InvalidArgumentError)
      }
      expect(mockSubjectsRepository.findOrCreate).not.toHaveBeenCalled();
    })

});