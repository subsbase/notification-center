import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Topic, TopicDocument } from './schema';
import { BaseRepository } from '../base-repository';
import { RepositoryFactory } from '../repository.factory';

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

@Injectable()
export class TopicsRepositoryFactory extends RepositoryFactory<TopicDocument, TopicsRepository> {
  constructor(
    model: Model<TopicDocument>,
    repositoryType: { new (model: Model<TopicDocument>, realm: string): TopicsRepository },
  ) {
    super(model, repositoryType);
  }
}
