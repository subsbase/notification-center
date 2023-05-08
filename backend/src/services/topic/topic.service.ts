import { Injectable } from '@nestjs/common';
import { CreatedModel } from '../../repositories/helper-types';
import { TopicsRepository } from '../../repositories/topic/repository';
import { Topic } from '../../repositories/topic/schema';
import { Subject } from '../../repositories/subject/schema';

@Injectable()
export class TopicService {

    constructor(private readonly topicsRepository: TopicsRepository) {}

    async create(topic: Topic) : Promise<CreatedModel> {
        return await this.topicsRepository.create(topic);
    }

    async getByEvent(event: string, subject: Subject) : Promise<Topic>{
        return await this.topicsRepository.findOrCreate({ event: event, subject: subject});
    }
}
