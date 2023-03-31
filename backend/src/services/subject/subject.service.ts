import { Injectable } from '@nestjs/common';
import { Subject } from '../../repositories/subject/schema';
import { SubjectsRepository } from '../../repositories/subject/repository';
import { CreatedModel, UpdatedModel } from '../../repositories/helper-types';

@Injectable()
export class SubjectService {
  constructor(private readonly subjectsRepository: SubjectsRepository) {}
  
  getAll(pageNum: number, pageSize: number): Promise<Array<Subject>> {
    return this.subjectsRepository.find({}, { 
        skip: (pageNum - 1) * pageSize,
        limit: pageSize
      })
  }
  
  async create(subject: Subject): Promise<CreatedModel> {
    return await this.subjectsRepository.create(subject);
  }

  async update(subject: Subject): Promise<UpdatedModel> {
    return await this.subjectsRepository.update(subject._id, subject)
  }
}
