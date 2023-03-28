import { Injectable, NotFoundException } from "@nestjs/common";
import { Notification } from "../../repositories/subscriber/notification/schema";
import { NotificationService } from "../../services/notification/notification.service";
import { NotificationTemplateService } from "../../services/notification-template/notification-template.service";
import { TopicService } from "../../services/topic/topic.service";

@Injectable()
export class NotificationManager {
    constructor(
            private readonly notificationTemplateService: NotificationTemplateService,
            private readonly notificationService: NotificationService,
            private readonly topicsService: TopicService) { }

    async getAllNotifications(subscriberId: string, pageNum: number, pageSize: number) : Promise<Array<Notification>> {
        const notifications = await this.notificationService.getNotifications(subscriberId, pageNum, pageSize)
        return notifications?? new Array()
    }

    async markAsRead(subscriberId: string, notificationId: string) {
        await this.notificationService.markAsRead(subscriberId, notificationId);
    }

    async markSomeAsRead(subscriberId: string, notificationsIds: [string]) {
        await this.notificationService.markManyRead(subscriberId, notificationsIds);
    }

    async markAllAsRead(subscriberId: string) {
        await this.notificationService.markAllAsRead(subscriberId);
    }

    async notify(
        event: string,
        actionUrl: string,
        payload: any,
        subscribersIds: [string]
        ) {

        const topic = await  this.topicsService.getByEvent(event);

        if(!topic){
            throw new NotFoundException(null, `No Topic found with event ${event}`)
        }

        const notificationTemplate = topic.notificationTemplate;

        const content = this.notificationService.compileContent(notificationTemplate.template!, payload)
        
        await this.notificationService.notifyAll(subscribersIds, Notification.create(topic, content, actionUrl))
    }
}