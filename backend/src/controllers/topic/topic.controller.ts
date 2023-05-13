import { Body, Controller, Post } from '@nestjs/common';
import { TopicsManager } from '../../managers/topic/topics.manager';
import { Topic } from '../../repositories/topic/schema';
import { BaseController } from '../base-controller';
import { IActionResult } from '../response-helpers/action-result.interface';
import { Authorize } from '../decorators/authorize.decorator';

@Controller('topics')
export class TopicsController extends BaseController {
  constructor(private readonly topicManager: TopicsManager) {
    super();
  }

  @Authorize()
  @Post()
  async create(@Body() topic: Topic): Promise<IActionResult> {
    const result = await this.topicManager.create(topic);
    return this.ok(result);
  }
}
