import { Body, Controller, Param, Post } from '@nestjs/common';
import { NotificationManager } from '../../managers/notification/notification.manager';
import { BaseController } from '../base-controller';
import { IActionResult } from '../response-helpers/action-result.interface';
import { NotificationDto } from './notification.dto';
import { Authorize } from '../decorators/authorize.decorator';

@Controller('notifications')
export class NotificationsController extends BaseController {
  constructor(private readonly notificationManager: NotificationManager) {
    super();
  }

  @Authorize()
  @Post('trigger/:subjectId/:topicId')
  async trigger(
    @Param('subjectId') subjectId: string,
    @Param('topicId') topicId: string,
    @Body() notificationDto: NotificationDto,
  ): Promise<IActionResult> {
    await this.notificationManager.notify(
      subjectId,
      topicId,
      notificationDto.actionUrl,
      notificationDto.payload,
      notificationDto.to,
    );
    return this.ok();
  }
}
