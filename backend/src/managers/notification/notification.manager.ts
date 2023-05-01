import { Injectable, NotFoundException } from "@nestjs/common";
import { EventsGateway } from '../../events/events.gateway';
import { Notification } from '../../repositories/subscriber/notification/schema';
import { NotificationService } from '../../services/notification/notification.service';
import { TopicService } from '../../services/topic/topic.service';
import { Payload } from "../../types/global-types";
import { UpdatedModel } from '../../repositories/helper-types';

@Injectable()
export class NotificationManager {
    constructor(
            private readonly eventsGateway: EventsGateway,
            private readonly notificationService: NotificationService,
            private readonly topicsService: TopicService) { }
            

    async getAllNotifications(subscriberId: string, pageNum: number, pageSize: number) : Promise<Array<Notification>> {
        const notifications = await this.notificationService.getNotifications(subscriberId, pageNum, 30)
        return notifications?? new Array()
    }

    archive(subscriberId: string, notificationsIds: Array<string>) : Promise<UpdatedModel> {
        return this.notificationService.archive(subscriberId, notificationsIds)
    }

    unarchive(subscriberId: string, archivedNotificationsIds: Array<string>) : Promise<UpdatedModel> {
        return this.notificationService.unarchive(subscriberId, archivedNotificationsIds)
    }

    async markAsRead(subscriberId: string, notificationId: string) {
        await this.notificationService.markAsRead(subscriberId, notificationId);
    }

    async markAsUnRead(subscriberId: string, notificationId: string) {
        await this.notificationService.markAsUnRead(subscriberId, notificationId);
    }

    async markManyAsRead(subscriberId: string, notificationsIds: Array<string>) {
        await this.notificationService.markManyAsRead(subscriberId, notificationsIds);
    }

    async markManyAsUnRead(subscriberId: string, notificationsIds: Array<string>) {
        await this.notificationService.markManyAsUnRead(subscriberId, notificationsIds);
    }

    async markAllAsRead(subscriberId: string) {
        await this.notificationService.markAllAsRead(subscriberId);
    }

    async markAllAsUnRead(subscriberId: string) {
        await this.notificationService.markAllAsUnRead(subscriberId);
    }

    async notify(
        event: string,
        actionUrl: string,
        payload: Payload,
        subscribersIds: Array<string>
        ) {

        const topic = await  this.topicsService.getByEvent(event);

        if(!topic){
            throw new NotFoundException(null, `No Topic found with event ${event}`)
        }

        const notificationTemplate = topic.notificationTemplate;

        const content = this.notificationService.compileContent(notificationTemplate?.template, payload)
        
        const notification =  this.notificationService.buildNotification(topic, content, actionUrl)

        await this.notificationService.notifyAll(subscribersIds, notification)

        this.eventsGateway.notifySubscribers(notification, subscribersIds)
    }
}