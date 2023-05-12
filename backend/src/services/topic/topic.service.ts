import { Injectable } from '@nestjs/common';
import { CreatedModel } from '../../repositories/helper-types';
import { TopicsRepository } from '../../repositories/topic/repository';
import { Topic } from '../../repositories/topic/schema';
import { Subject } from '../../repositories/subject/schema';
import { TopicProcessor } from './topic.processor';

@Injectable()
export class TopicService {

    constructor(
        private readonly topicProcessor: TopicProcessor,
        private readonly topicsRepository: TopicsRepository) {}

    async create(topic: Topic) : Promise<CreatedModel> {
        this.topicProcessor.validateEvent(topic.id)
        return await this.topicsRepository.create(topic);
    }

    async getOrCreateByEvent(event: string, subject: Subject) : Promise<Topic>{
        this.topicProcessor.validateEvent(event)
        const name = this.topicProcessor.getTopicNameFormEvent(event);
        return await this.topicsRepository.findOrCreate({ id: event.toLowerCase(), name: name, subject: subject });
    }
}
