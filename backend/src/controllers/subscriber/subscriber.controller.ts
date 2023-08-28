import { Body, Controller, Get, Inject, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { NotificationManager } from '../../managers/notification/notification.manager';
import { SubscriberManager } from '../../managers/subscriber/subscriber.manager';
import { Subscriber } from '../../repositories/subscriber/schema';
import { BaseController } from '../base-controller';
import { NumberPipeTransform } from '../pipes/number.pipe-transform';
import { IActionResult } from '../response-helpers/action-result.interface';
import { Authorize } from '../decorators/authorize.decorator';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from '../../types/global-types';
import { SnoozedNotificationDto } from './snooze.notification.dto';

@Controller('subscribers')
export class SubscribersController extends BaseController {
  constructor(
    @Inject(REQUEST) protected readonly request: FastifyRequest,
    private readonly notificationManager: NotificationManager,
    private readonly subscriberManager: SubscriberManager,
  ) {
    super(request);
  }

  @Authorize()
  @Post()
  async create(@Body() subscriber: Subscriber): Promise<IActionResult> {
    const result = await this.subscriberManager.create(this.Realm, subscriber);
    return this.ok(result);
  }

  @Get(':subscriberId/notifications')
  async listNotifications(
    @Param('subscriberId')
    subscriberId: string,
    @Query('pageNum', new NumberPipeTransform(1))
    pageNum: number,
    @Query('pageSize', new NumberPipeTransform(5))
    pageSize: number,
  ): Promise<IActionResult> {
    const notifications = await this.notificationManager.getAllNotifications(
      this.Realm,
      subscriberId,
      pageNum,
      pageSize,
    );

    return this.ok(notifications);
  }

  @Get(':subscriberId/notifications/countunread')
  async countUnreadNotifications(@Param('subscriberId') subscriberId: string): Promise<IActionResult> {
    const result = this.notificationManager.countUnread(this.Realm, subscriberId);
    return this.ok(result);
  }

  @Get(':subscriberId/notifications/archived')
  async listArchivedNotifications(
    @Param('subscriberId')
    subscriberId: string,
    @Query('pageNum', new NumberPipeTransform(1))
    pageNum: number,
    @Query('pageSize', new NumberPipeTransform(5))
    pageSize: number,
  ): Promise<IActionResult> {
    const archivedNotifications = await this.notificationManager.getAllArchivedNotifications(
      this.Realm,
      subscriberId,
      pageNum,
      pageSize,
    );

    return this.ok(archivedNotifications);
  }

  @Patch(':subscriberId/notifications/:notificationId/markasread')
  async markAsRead(
    @Param('subscriberId')
    subscriberId: string,
    @Param('notificationId')
    notificationId: string,
  ): Promise<IActionResult> {
    await this.notificationManager.markAsRead(this.Realm, subscriberId, notificationId);
    return this.ok();
  }

  @Patch(':subscriberId/notifications/:notificationId/markasunread')
  async markAsUnread(
    @Param('subscriberId')
    subscriberId: string,
    @Param('notificationId')
    notificationId: string,
  ): Promise<IActionResult> {
    await this.notificationManager.markAsUnread(this.Realm, subscriberId, notificationId);
    return this.ok();
  }

  @Patch(':subscriberId/notifications/markasread')
  async markAllAsRead(@Param('subscriberId') subscriberId: string): Promise<IActionResult> {
    await this.notificationManager.markAllAsRead(this.Realm, subscriberId);
    return this.ok();
  }

  @Patch(':subscriberId/notifications/markasunread')
  async markAllAsUnread(@Param('subscriberId') subscriberId: string): Promise<IActionResult> {
    await this.notificationManager.markAllAsUnread(this.Realm, subscriberId);
    return this.ok();
  }

  @Patch(':subscriberId/notifications/markmanyasread')
  async markManyAsRead(@Param('subscriberId') subscriberId: string, @Body() notificationsIds: Array<string>) {
    await this.notificationManager.markManyAsRead(this.Realm, subscriberId, notificationsIds);
    return this.ok();
  }

  @Patch(':subscriberId/notifications/markmanyasunread')
  async markManyAsUnread(@Param('subscriberId') subscriberId: string, @Body() notificationsIds: Array<string>) {
    await this.notificationManager.markManyAsUnread(this.Realm, subscriberId, notificationsIds);
    return this.ok();
  }

  @Put(':subscriberId/notifications/archive')
  async archive(@Param('subscriberId') subscriberId: string, @Body() notificationsIds: Array<string>) {
    const result = await this.notificationManager.archive(this.Realm, subscriberId, notificationsIds);
    return this.ok(result);
  }

  @Put(':subscriberId/notifications/unarchive')
  async unarchive(@Param('subscriberId') subscriberId: string, @Body() archivedNotificationsIds: Array<string>) {
    const result = await this.notificationManager.unarchive(this.Realm, subscriberId, archivedNotificationsIds);
    return this.ok(result);
  }

  @Post(':subscriberId/notifications/snooze')
  async snooze(@Param('subscriberId') subscriberId: string, @Body() snoozedNotificationsDto: SnoozedNotificationDto) {
    const snoozeUntilDate = new Date(snoozedNotificationsDto.snoozeUntil);
    const result = await this.notificationManager.snooze(
      this.Realm,
      subscriberId,
      snoozedNotificationsDto.notificationsIds,
      snoozeUntilDate,
    );
    if (!result.success) {
      return this.badRequest(result);
    }
    return this.ok(result);
  }
}
