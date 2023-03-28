import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { NotificationManager } from '../../managers/notification/notification.manager';
import { BaseController } from '../base-controller';
import { NumberPipeTransform } from '../pipes/number.pipe-transform';
import { IActionResult } from '../response-helpers/action-result.interface';

@Controller('subscriber')
export class SubscriberController extends BaseController {

    constructor(private readonly notificationManager: NotificationManager) {
        super();
    }

    @Get(':subscriberId/notifications')
    async listNotifications(
        @Param('subscriberId') 
        subscriberId: string,
        @Query('pageNum', new NumberPipeTransform(1)) 
        pageNum: number,
        @Query('pageSize', new NumberPipeTransform(5))
        pageSize: number
        ) : Promise<IActionResult> {

        const notifications = await this.notificationManager.getAllNotifications(subscriberId, pageNum, pageSize)

        return this.ok(notifications);        
    }


    @Patch(':subscriberId/notification/:notificationId/markasread')
    async markAsRead(
        @Param('subscriberId')
        subscriberId: string,
        @Param('notificationId')
        notificationId: string
    ): Promise<IActionResult> {
        await this.notificationManager.markAsRead(subscriberId, notificationId);
        return this.ok();
    }

    @Patch(':subscriberId/notifications/markasread')
    async markAllAsRead(@Param('subscriberId') subscriberId: string): Promise<IActionResult> {
        await this.notificationManager.markAllAsRead(subscriberId);
        return this.ok();
    }

    @Patch(':subscriberId/notifications/marksomeasread')
    async markSomeAsRead(@Param('subscriberId') subscriberId: string, @Body() notificationsIds: [string]) {
        await this.notificationManager.markSomeAsRead(subscriberId, notificationsIds);
        return this.ok();
    }
}