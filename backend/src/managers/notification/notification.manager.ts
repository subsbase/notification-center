import { Injectable, NotFoundException } from "@nestjs/common";
import { EventsGateway } from "../../events/events.gateway";
import { Notification } from "../../repositories/subscriber/notification/schema";
import { NotificationService } from "../../services/notification/notification.service";
import { TopicService } from "../../services/topic/topic.service";

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

    async markAsUnRead(subscriberId: string, notificationId: string) {
        await this.notificationService.markAsUnRead(subscriberId, notificationId);
    }

    async markSomeAsRead(subscriberId: string, notificationsIds: Array<string>) {
        await this.notificationService.markManyRead(subscriberId, notificationsIds);
    }

    async markAllAsRead(subscriberId: string) {
        await this.notificationService.markAllAsRead(subscriberId);
    }

    async notify(
        event: string,
        actionUrl: string,
        payload: any,
        subscribersIds: Array<string>
        ) {

        const topic = await  this.topicsService.getByEvent(event);

        if(!topic){
            throw new NotFoundException(null, `No Topic found with event ${event}`)
        }

        const notificationTemplate = topic.notificationTemplate;

        const content = this.notificationService.compileContent(notificationTemplate.template!, payload)
        const notification =  Notification.create(topic, content, actionUrl)

        await this.notificationService.notifyAll(subscribersIds, notification)
        this.eventsGateway.notifySubscribers(notification, subscribersIds )
    }
}