import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { NotificationManager } from '../../managers/notification/notification.manager';
import { BaseController } from '../base-controller';
import { IActionResult } from '../response-helpers/action-result.interface';
import { NotificationDto } from './notification.dto';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from '../../types/global-types';
import { Authorize } from '../decorators/authorize.decorator';

@Controller('notifications')
export class NotificationsController extends BaseController {

    constructor(
        @Inject(REQUEST) protected readonly request: FastifyRequest,
        private readonly notificationManager: NotificationManager) {
        super(request);
    }

    @Authorize()
    @Post('trigger/:event')
    async trigger(@Param('event') event: string, @Body() notificationDto: NotificationDto ) : Promise<IActionResult> {
        await this.notificationManager.notify(event, notificationDto.actionUrl, notificationDto.payload ,notificationDto.to)
        return this.ok();
    }
}
