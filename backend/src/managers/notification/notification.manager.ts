import { Injectable, NotFoundException } from "@nestjs/common";
import { EventsGateway } from "../../events/events.gateway";
import { Notification } from "../../repositories/subscriber/notification/schema";
import { NotificationService } from "../../services/notification/notification.service";
import { TopicService } from "../../services/topic/topic.service";
import { Payload } from "../../types/global-types";

@Injectable()
export class NotificationManager {
    constructor(
            private readonly eventsGateway: EventsGateway,
            private readonly notificationService: NotificationService,
            private readonly topicsService: TopicService) { }
            

    async getAllNotifications(subscriberId: string, pageNum: number, pageSize: number) : Promise<Array<Notification>> {
        const notifications = await this.notificationService.getNotifications(subscriberId, pageNum, pageSize)
        return notifications?? new Array()
    }

    async markAsRead(subscriberId: string, notificationId: string) {
        await this.notificationService.markAsRead(subscriberId, notificationId);
    }

    async markManyAsRead(subscriberId: string, notificationsIds: Array<string>) {
        await this.notificationService.markManyAsRead(subscriberId, notificationsIds);
    }

    async markAllAsRead(subscriberId: string) {
        await this.notificationService.markAllAsRead(subscriberId);
    }

    async markAsUnread(subscriberId: string, notificationId: string) {
        await this.notificationService.markAsUnread(subscriberId, notificationId);
    }

    async markManyAsUnread(subscriberId: string, notificationsIds: Array<string>) {
        await this.notificationService.markManyAsUnread(subscriberId, notificationsIds);
    }

    async markAllAsUnread(subscriberId: string) {
        await this.notificationService.markAllAsUnread(subscriberId);
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