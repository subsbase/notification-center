import { Injectable } from '@nestjs/common';
import { CreatedModel, UpdatedModel } from '../../repositories/helper-types';
import { Topic } from '../../repositories/subject/topic/schema';
import { Subject } from '../../repositories/subject/schema';
import { TopicProcessor } from './topic.processor';
import { SubjectsRepositoryFactory } from '../../repositories/subject/repository';
import { NotificationTemplate } from '../../repositories/subject/topic/notification-template/schema';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicProcessor: TopicProcessor,
    private readonly subjectsRepositoryFactory : SubjectsRepositoryFactory
  ) {}
  
  getFromSubjectById(subject: Subject, id: string) : Topic | undefined {
    return subject.topics.get(id)
  }

  getById(realm: string, subjectId:string, id: string): Topic | Promise<Topic | null> {
   return this.subjectsRepositoryFactory.create(realm).aggregate([
        { $match: { _id: subjectId } },
        { $project: {
          topics: {
            $filter: {
              input: { $objectToArray: "$topics" },
              as: 'topic',
              cond: { $eq: [ '$$topic.k', id] } 
            }
          }
        } 
        },
        {
          $project: {
            topics: {
              $arrayToObject: '$topics'
            }
          }
        }
    ]).then(aggregationResult => {
      const topics = aggregationResult[0]?.topics
      const topicDescriptor = Object.getOwnPropertyDescriptor(topics, id)
      return topicDescriptor?.value
    })
  }

  async create(realm: string, subjectId: string, id: string, topic: Topic): Promise<CreatedModel> {
    this.topicProcessor.validateId(id, 'topic id');
    const subjectRepository = this.subjectsRepositoryFactory.create(realm);
    topic = topic.notificationTemplates ? topic : {...topic, notificationTemplates: new Map<string, NotificationTemplate>()}
    const updateResult = await subjectRepository.update(subjectId, { $set: { [`topics.${id}`] : topic } });
    return { id: id, created: updateResult.modifiedCount > 0 }
  }

  async getOrCreate(realm: string, id: string, subject: Subject): Promise<Topic> {
    const topics = subject.topics ?? new Map<string, Topic>();
    let topic: Topic;
    topic = topics.get(id)!
    if(!topic){
      this.topicProcessor.validateId(id, 'topic.id');
      topic = this.topicProcessor.buildEmptyTopic();
      topics.set(id, topic)
      await this.subjectsRepositoryFactory.create(realm).update(subject.id, { topics: topics })
    }
    return topic;
  }

  async setNotificationTemplate(realm: string, subjectId: string, topicId: string, templateId: string, title: string, message: string): Promise<CreatedModel> {
    this.topicProcessor.validateId(subjectId, 'subject id');
    this.topicProcessor.validateId(topicId, 'topic id');
    this.topicProcessor.validateId(templateId, 'templateId');
    const subjectRepository = this.subjectsRepositoryFactory.create(realm);
    const notificationTemplate = this.topicProcessor.buildNotificationTemplate(title, message)
    const updateResult = await subjectRepository.update(subjectId, { $set: { [`topics.${topicId}.notificationTemplates.${templateId}`] : notificationTemplate } });
    return { id: templateId, created: updateResult.modifiedCount > 0 }
  }

  //returns title template and message template
  getNotificationTemplate(
    topic: Topic,
    title: string,
    message: string,
    templateId: string
  ): [string,string]{
    return this.topicProcessor.tryGetNotificationTemplate(topic, templateId, title, message)
  }

  async update(realm: string, subjectId: string, id: string ,topic: Topic): Promise<UpdatedModel> {
    this.topicProcessor.validateId(subjectId, 'subjectId')
    this.topicProcessor.validateId(id, 'topicId')
    return this.subjectsRepositoryFactory.create(realm).update(subjectId, { $set: { [`topics.${id}`]: topic }});
  }
}
