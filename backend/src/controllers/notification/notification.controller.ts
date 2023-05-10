import { Body, Controller, Param, Post } from '@nestjs/common';
import { NotificationManager } from '../../managers/notification/notification.manager';
import { BaseController } from '../base-controller';
import { IActionResult } from '../response-helpers/action-result.interface';
import { NotificationDto } from './notification.dto';
import { Authorize } from '../decorators/authorize.decorator';

@Controller('notifications')
export class NotificationsController extends BaseController {

    constructor(
        private readonly notificationManager: NotificationManager) {
        super();
    }

    @Authorize()
    @Post('trigger/:subject/:event')
    async trigger(
        @Param('subject') subject: string,
        @Param('event') event: string,
        @Body() notificationDto: NotificationDto ) : Promise<IActionResult> {
        await this.notificationManager.notify(subject, event, notificationDto.actionUrl, notificationDto.payload ,notificationDto.to)
        return this.ok();
    }
}
