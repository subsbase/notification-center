import { Injectable } from '@nestjs/common';
import { CreatedModel } from '../../repositories/helper-types';
import { TopicsRepositoryFactory } from '../../repositories/topic/repository';
import { Topic } from '../../repositories/topic/schema';
import { Subject } from '../../repositories/subject/schema';
import { TopicProcessor } from './topic.processor';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicProcessor: TopicProcessor,
    private readonly topicsRepositoryFactory: TopicsRepositoryFactory,
  ) {}

  async create(realm: string, topic: Topic): Promise<CreatedModel> {
    this.topicProcessor.validateId(topic.id, 'topic.id');
    return await this.topicsRepositoryFactory.create(realm).create(topic);
  }

  async getOrCreate(realm: string, id: string, subject: Subject): Promise<Topic> {
    this.topicProcessor.validateId(id, 'topic.id');
    const name = this.topicProcessor.getTopicNameFormId(id);
    return await this.topicsRepositoryFactory.create(realm).findOrCreate({ id: id, name: name, subject: subject });
  }
}
