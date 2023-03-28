import { Injectable } from "@nestjs/common";
import Handlebars from "handlebars";
import { NotificationsTemplatesRepository } from "../../repositories/notification-template/repository";
import { NotificationTemplate } from "../../repositories/notification-template/schema";

@Injectable()
export class NotificationTemplateService {

    constructor(private readonly notificationTemplateRepository: NotificationsTemplatesRepository) {}

    async getByName(notificationTemplateName: string): Promise<NotificationTemplate | null> {
        return await this.notificationTemplateRepository.findOne({ name: notificationTemplateName });
    }
}