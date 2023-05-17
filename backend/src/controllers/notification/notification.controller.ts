import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { NotificationManager } from '../../managers/notification/notification.manager';
import { BaseController } from '../base-controller';
import { IActionResult } from '../response-helpers/action-result.interface';
import { NotificationDto } from './notification.dto';
import { Authorize } from '../decorators/authorize.decorator';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from '../../types/global-types';

@Controller('notifications')
export class NotificationsController extends BaseController {
  constructor(
    @Inject(REQUEST) protected readonly request: FastifyRequest,
    private readonly notificationManager: NotificationManager,
  ) {
    super(request);
  }

  @Authorize()
  @Post('trigger/:subjectId/:topicId')
  async trigger(
    @Param('subjectId') subjectId: string,
    @Param('topicId') topicId: string,
    @Body() notificationDto: NotificationDto,
  ): Promise<IActionResult> {
    await this.notificationManager.notify(
      this.Realm,
      subjectId,
      topicId,
      notificationDto.actionUrl,
      notificationDto.payload,
      notificationDto.to,
      notificationDto.notificationTemplate?.templeteId,
      notificationDto.notificationTemplate?.notificationTemplate,
    );
    return this.ok();
  }
}
