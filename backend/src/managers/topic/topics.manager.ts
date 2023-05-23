import { Injectable } from '@nestjs/common';
import { CreatedModel, UpdatedModel } from '../../repositories/helper-types';
import { Topic } from '../../repositories/subject/topic/schema';
import { TopicService } from '../../services/topic/topic.service';

@Injectable()
export class TopicsManager {
  constructor(private readonly topicsService: TopicService) {}
  async create(realm: string,subjectId:string, id: string, topic: Topic): Promise<CreatedModel> {
    return await this.topicsService.create(realm, subjectId, id, topic);
  }

  async setNotificationTemplate(realm: string,subjectId: string, topicId: string, templateId: string, titleTemplate: string, messageTemplate: string) : Promise<CreatedModel> {
    return await this.topicsService.setNotificationTemplate(realm, subjectId, topicId, templateId,titleTemplate,  messageTemplate)
  }

  async update(realm: string, subjectId: string, id: string ,topic: Topic): Promise<UpdatedModel> {
    return await this.topicsService.update(realm,subjectId,id,topic);
  }

  async getById(realm: string, subjectId: string ,id: string) : Promise<Topic | null> {
    return await this.topicsService.getById(realm, subjectId ,id)
  }
}
