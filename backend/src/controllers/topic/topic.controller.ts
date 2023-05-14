import { Body, Controller, Inject, Post } from '@nestjs/common';
import { TopicsManager } from '../../managers/topic/topics.manager';
import { Topic } from '../../repositories/topic/schema';
import { BaseController } from '../base-controller';
import { IActionResult } from '../response-helpers/action-result.interface';
import { Authorize } from '../decorators/authorize.decorator';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from '../../types/global-types';

@Controller('topics')
export class TopicsController extends BaseController {
  constructor(
    @Inject(REQUEST) protected readonly request: FastifyRequest,
    private readonly topicManager: TopicsManager,
  ) {
    super(request);
  }

  @Authorize()
  @Post()
  async create(@Body() topic: Topic): Promise<IActionResult> {
    const result = await this.topicManager.create(this.Realm, topic);
    return this.ok(result);
  }
}
