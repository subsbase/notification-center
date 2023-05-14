import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Subject, SubjectDocument } from './schema';
import { BaseRepository } from '../base-repository';
import { RepositoryFactory } from '../repository.factory';

@Injectable()
export class SubjectsRepository extends BaseRepository<SubjectDocument, Subject> {
  constructor(model: Model<SubjectDocument>, realm: string) {
    super(model, realm);
  }
}

@Injectable()
export class SubjectsRepositoryFactory extends RepositoryFactory<SubjectDocument, SubjectsRepository> {
  constructor(
    model: Model<SubjectDocument>,
    repositoryType: { new (model: Model<SubjectDocument>, realm: string): SubjectsRepository },
  ) {
    super(model, repositoryType);
  }
}
