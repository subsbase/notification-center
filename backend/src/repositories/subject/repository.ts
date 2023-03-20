import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base-repository';
import { Subject, SubjectDocument } from './schema';

@Injectable()
export class SubjectsRepository extends BaseRepository<SubjectDocument> {
  constructor(
    @InjectModel(Subject.name)
    protected readonly model: Model<SubjectDocument>,
  ) {
    super(model);
  }
}
