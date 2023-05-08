import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { NotificationManager } from '../../managers/notification/notification.manager';
import { SubscriberManager } from '../../managers/subscriber/subscriber.manager';
import { Subscriber } from '../../repositories/subscriber/schema';
import { BaseController } from '../base-controller';
import { NumberPipeTransform } from '../pipes/number.pipe-transform';
import { IActionResult } from '../response-helpers/action-result.interface';
import { Authorize } from '../decorators/authorize.decorator';


@Controller('subscribers')
export class SubscribersController extends BaseController {

    constructor(
        private readonly notificationManager: NotificationManager,
        private readonly subscriberManager: SubscriberManager) {
        super();
    }

    @Authorize()
    @Post()
    async create(@Body() subscriber: Subscriber): Promise<IActionResult> {
        const result = await this.subscriberManager.create(subscriber)
        return this.ok(result);
    }

    @Get(':subscriberId/notifications')
    async listNotifications(
        @Param('subscriberId')
        subscriberId: string,
        @Query('pageNum', new NumberPipeTransform(1))
        pageNum: number,
        @Query('pageSize', new NumberPipeTransform(5))
        pageSize: number
    ): Promise<IActionResult> {

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
    
    @Patch(':subscriberId/notification/:notificationId/markasunread')
    async markAsUnread(
        @Param('subscriberId')
        subscriberId: string,
        @Param('notificationId')
        notificationId: string
    ): Promise<IActionResult> {
        await this.notificationManager.markAsUnread(subscriberId, notificationId);
        return this.ok();
    }

    @Patch(':subscriberId/notifications/markasread')
    async markAllAsRead(@Param('subscriberId') subscriberId: string): Promise<IActionResult> {
        await this.notificationManager.markAllAsRead(subscriberId);
        return this.ok();
    }

    @Patch(':subscriberId/notifications/markasunread')
    async markAllAsUnread(@Param('subscriberId') subscriberId: string): Promise<IActionResult> {
        await this.notificationManager.markAllAsUnread(subscriberId);
        return this.ok();
    }

    @Patch(':subscriberId/notifications/markmanyasread')
    async markManyAsRead(@Param('subscriberId') subscriberId: string, @Body() notificationsIds: Array<string>) {
        await this.notificationManager.markManyAsRead(subscriberId, notificationsIds);
        return this.ok();
    }

    @Patch(':subscriberId/notifications/markmanyasunread')
    async markManyAsUnread(@Param('subscriberId') subscriberId: string, @Body() notificationsIds: Array<string>) {
        await this.notificationManager.markManyAsUnread(subscriberId, notificationsIds);
        return this.ok();
    }

    @Put(':subscriberId/notifications/archive')
    async archive(@Param('subscriberId') subscriberId: string, @Body() notificationsIds: Array<string>) {
        const result =  await this.notificationManager.archive(subscriberId, notificationsIds);
        return this.ok(result);
    }

    @Put(':subscriberId/notifications/unarchive')
    async unarchive(@Param('subscriberId') subscriberId: string, @Body() archivedNotificationsIds: Array<string>) {
        const result =  await this.notificationManager.unarchive(subscriberId, archivedNotificationsIds);
        return this.ok(result);
    }
}
