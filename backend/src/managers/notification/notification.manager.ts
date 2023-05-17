import { Injectable } from '@nestjs/common';
import { EventsGateway } from '../../events/events.gateway';
import { Notification } from '../../repositories/subscriber/notification/schema';
import { NotificationService } from '../../services/notification/notification.service';
import { TopicService } from '../../services/topic/topic.service';
import { Payload } from '../../types/global-types';
import { UpdatedModel } from '../../repositories/helper-types';
import { SubjectService } from '../../services/subject/subject.service';
import { ArchivedNotification } from '../../repositories/subscriber/archived-notification/schema';
import { NotificationTemplate } from '../../repositories/topic/notification-template/schema';

@Injectable()
export class NotificationManager {
  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly notificationService: NotificationService,
    private readonly topicsService: TopicService,
    private readonly subjectService: SubjectService,
  ) {}

  async getAllNotifications(
    realm: string,
    subscriberId: string,
    pageNum: number,
    pageSize: number,
  ): Promise<Array<Notification>> {
    const notifications = await this.notificationService.getNotifications(realm, subscriberId, pageNum, pageSize);
    return notifications ?? new Array();
  }

  async countUnread(realm: string, subscriberId: string) {
    const unreadNotificationsCount = await this.notificationService.countUnread(realm, subscriberId);
    return { count: unreadNotificationsCount };
  }

  async getAllArchivedNotifications(
    realm: string,
    subscriberId: string,
    pageNum: number,
    pageSize: number,
  ): Promise<Array<ArchivedNotification>> {
    const notifications = await this.notificationService.getArchivedNotifications(
      realm,
      subscriberId,
      pageNum,
      pageSize,
    );
    return notifications ?? new Array();
  }

  archive(realm: string, subscriberId: string, notificationsIds: Array<string>): Promise<UpdatedModel> {
    return this.notificationService.archive(realm, subscriberId, notificationsIds);
  }

  unarchive(realm: string, subscriberId: string, archivedNotificationsIds: Array<string>): Promise<UpdatedModel> {
    return this.notificationService.unarchive(realm, subscriberId, archivedNotificationsIds);
  }

  async markAsRead(realm: string, subscriberId: string, notificationId: string) {
    await this.notificationService.markAsRead(realm, subscriberId, notificationId);
  }

  async markManyAsRead(realm: string, subscriberId: string, notificationsIds: Array<string>) {
    await this.notificationService.markManyAsRead(realm, subscriberId, notificationsIds);
  }

  async markAllAsRead(realm: string, subscriberId: string) {
    await this.notificationService.markAllAsRead(realm, subscriberId);
  }

  async markAsUnread(realm: string, subscriberId: string, notificationId: string) {
    await this.notificationService.markAsUnread(realm, subscriberId, notificationId);
  }

  async markManyAsUnread(realm: string, subscriberId: string, notificationsIds: Array<string>) {
    await this.notificationService.markManyAsUnread(realm, subscriberId, notificationsIds);
  }

  async markAllAsUnread(realm: string, subscriberId: string) {
    await this.notificationService.markAllAsUnread(realm, subscriberId);
  }

  async notify(
    realm: string,
    subjectId: string,
    topicId: string,
    actionUrl: string,
    payload: Payload,
    subscribersIds: Array<string>,
    templateId: string,
    notificationTemplate: NotificationTemplate,
  ) {
    const subject = await this.subjectService.getOrCreate(realm, subjectId);

    //gets or creates topic by the topicId
    const topic = await this.topicsService.getOrCreate(realm, topicId, subject);

    const template = await this.topicsService.getNotificationTemplate(realm, templateId, notificationTemplate, topic);

    const content = this.notificationService.compileContent(template, payload);

    const notification = this.notificationService.buildNotification(topic, content, actionUrl);

    await this.notificationService.notifyAll(realm, subscribersIds, notification);

    this.eventsGateway.notifySubscribers(notification, subscribersIds);
  }
}
