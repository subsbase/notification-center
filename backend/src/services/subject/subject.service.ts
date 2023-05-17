import { Injectable } from '@nestjs/common';
import { Subject } from '../../repositories/subject/schema';
import { SubjectsRepositoryFactory } from '../../repositories/subject/repository';
import { CreatedModel, UpdatedModel } from '../../repositories/helper-types';
import { SubjectProcessor } from './subject.processor';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectProcessor: SubjectProcessor,
    private readonly subjectsRepositoryFactory: SubjectsRepositoryFactory,
  ) {}

  getAll(realm: string, pageNum: number, pageSize: number): Promise<Array<Subject>> {
    return this.subjectsRepositoryFactory.create(realm).find(
      {},
      {},
      {
        skip: (pageNum - 1) * pageSize,
        limit: pageSize,
      },
    );
  }

  getOrCreate(realm: string, subjectId: string): Promise<Subject> {
    this.subjectProcessor.validateSubjectId(subjectId);
    const title = this.subjectProcessor.getTitleFormId(subjectId);
    return this.subjectsRepositoryFactory.create(realm).findOrCreate({ id: subjectId, title });
  }

  create(realm: string, subject: Subject): Promise<CreatedModel> {
    this.subjectProcessor.validateSubjectId(subject.id);
    return this.subjectsRepositoryFactory.create(realm).create(subject);
  }

  update(realm: string, subject: Subject): Promise<UpdatedModel> {
    this.subjectProcessor.validateSubjectId(subject.id);
    return this.subjectsRepositoryFactory.create(realm).update(subject.id, subject);
  }
}
