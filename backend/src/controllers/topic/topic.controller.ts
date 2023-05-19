import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { TopicsManager } from '../../managers/topic/topics.manager';
import { Topic } from '../../repositories/subject/topic/schema';
import { BaseController } from '../base-controller';
import { IActionResult } from '../response-helpers/action-result.interface';
import { Authorize } from '../decorators/authorize.decorator';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from '../../types/global-types';
import { NotificationTemplateDto } from './notification.template.dto';
import { TopicDto } from './topic.dto';

@Controller('topics')
export class TopicsController extends BaseController {
  constructor(
    @Inject(REQUEST) protected readonly request: FastifyRequest,
    private readonly topicManager: TopicsManager,
  ) {
    super(request);
  }

  @Authorize()
  @Get(':subjectId/:topicId')
  async getById(
    @Param('subjectId') subjectId: string,
    @Param('topicId') id: string) : Promise<IActionResult> {
    const result = await this.topicManager.getById(this.Realm, subjectId, id)
    if(!result){
      return this.notFound()
    }
    return this.ok(result);
  }

  @Authorize()
  @Post(':subjectId')
  async create(@Param('subjectId') subjectId: string, @Body() topicDto: TopicDto): Promise<IActionResult> {
    const topic = { notificationTemplates: topicDto.notificationTemplates }
    const result = await this.topicManager.create(this.Realm,subjectId, topicDto.id, topic);
    if(!result.created){
      return this.notFound({ message: `subject id ${subjectId} was not found` })
    }
    return this.ok(result);
  }

  @Authorize()
  @Put(':subjectId/:topicId')
  async update(
    @Param('subjectId') subjectId: string,
    @Param('topicId') id: string,
    @Body() topic: Topic): Promise<IActionResult> {
    const result = await this.topicManager.update(this.Realm, subjectId, id, topic)
    if(result.matchedCount < 1 || result.modifiedCount < 1){
      return this.notFound()
    }
    return this.ok(result);
  }

  @Authorize()
  @Post(':subjectId/:topicId/set-template')
  async setNotificationTemplate(
    @Param('subjectId') subjectId: string,
    @Param('topicId') id: string,
    @Body() notificationTemplate: NotificationTemplateDto) : Promise<IActionResult> {
      const result = await this.topicManager.setNotificationTemplate(this.Realm, subjectId, id, notificationTemplate.templateId, notificationTemplate.titleTemplate, notificationTemplate.messageTemplate);
      if(!result.created){
        return this.notFound({ subjectId: subjectId, topicId: id })
      }
      return this.ok(result);
  }
}
