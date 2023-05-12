import { Injectable } from '@nestjs/common';
import { Subject } from '../../repositories/subject/schema';
import { SubjectsRepository } from '../../repositories/subject/repository';
import { CreatedModel, UpdatedModel } from '../../repositories/helper-types';
import { SubjectProcessor } from './subject.processor';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectProcessor: SubjectProcessor,
    private readonly subjectsRepository: SubjectsRepository) {}
  
  getAll(pageNum: number, pageSize: number): Promise<Array<Subject>> {
    return this.subjectsRepository.find({}, {} , { 
        skip: (pageNum - 1) * pageSize,
        limit: pageSize
    })
  }
  
  getOrCreate(subjectKey: string) : Promise<Subject> {
    this.subjectProcessor.validateSubjectKey(subjectKey)
    const title = this.subjectProcessor.getTitleFormKey(subjectKey);
    return this.subjectsRepository.findOrCreate({ id: subjectKey, title })
  }

  async create(subject: Subject): Promise<CreatedModel> {
    this.subjectProcessor.validateSubjectKey(subject.id)
    return await this.subjectsRepository.create(subject);
  }

  async update(subject: Subject): Promise<UpdatedModel> {
    this.subjectProcessor.validateSubjectKey(subject.id)
    return await this.subjectsRepository.update(subject.id, subject)
  } 
}
