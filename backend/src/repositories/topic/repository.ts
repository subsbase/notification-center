import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Topic, TopicDocument } from './schema';
import { BaseRepository } from '../base-repository';

@Injectable()
export class TopicsRepository extends BaseRepository<TopicDocument, Topic> {
  constructor(
    @InjectModel(Topic.name)
    protected model: Model<TopicDocument>,
    protected readonly realm: string,
  ) {
    super(model, realm);
  }
}
