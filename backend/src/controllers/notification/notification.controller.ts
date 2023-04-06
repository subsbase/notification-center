import { Body, Controller, Param, Post } from '@nestjs/common';
import { NotificationManager } from '../../managers/notification/notification.manager';
import { BaseController } from '../base-controller';
import { IActionResult } from '../response-helpers/action-result.interface';
import { NotificationDto } from './notification.dto';

@Controller('notifications')
export class NotificationsController extends BaseController {

    constructor(private readonly notificationManager: NotificationManager) {
        super();
    }

    @Post('trigger/:event')
    async trigger(@Param('event') event: string, @Body() notificationDto: NotificationDto ) : Promise<IActionResult> {
        await this.notificationManager.notify(event, notificationDto.actionUrl, notificationDto.payload ,notificationDto.to)
        return this.ok();
    }
}
