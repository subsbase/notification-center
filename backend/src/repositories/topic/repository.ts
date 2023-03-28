import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base-repository';
import { Topic, TopicDocument } from './schema';

@Injectable()
export class TopicsRepository extends BaseRepository<TopicDocument, Topic> {
  constructor(@InjectModel(Topic.name) protected model: Model<TopicDocument>) {
    super(model);
  }
}
