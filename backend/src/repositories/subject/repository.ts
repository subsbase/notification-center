import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Subject, SubjectDocument } from './schema';
import { BaseRepository } from '../base-repository';

@Injectable()
export class SubjectsRepository extends BaseRepository<SubjectDocument, Subject> {
  constructor(
    @InjectModel(Subject.name)
    protected readonly model: Model<SubjectDocument>,
    protected readonly realm: string,
  ) {
    super(model, realm);
  }
}
