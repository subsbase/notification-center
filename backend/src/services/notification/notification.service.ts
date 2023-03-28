import { SubscribersRepository } from "../../repositories/subscriber/repository";
import { NotificationProcessor } from "./notification.processor";
import { Notification } from '../../repositories/subscriber/notification/schema'
import { Injectable } from "@nestjs/common";
import { AnyBulkWriteOperation } from 'mongodb'

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationProcessor: NotificationProcessor, 
        private readonly subscribersRepository: SubscribersRepository
        ) {}


    async getNotifications(subscriberId: string, pageNum: number = 1, pageSize: number = 5) : Promise<Array<Notification> | undefined> {
        const subscribers =  await this.subscribersRepository.aggregate ([
            { $match: { subscriberId: subscriberId } },
            {
                $project: {
                    notifications: { $slice: ['$notifications', (pageNum - 1) * pageSize, pageSize] }
                }
            }
        ]);

        return subscribers[0].notifications;
    }

    compileContent(template: string, payload: any): string {
        return this.notificationProcessor.compileContent(template, payload);
    }

    async notify(subscriberId: string, notification: Notification) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId },
            { $push: { notifications: notification }},
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }

    async notifyAll(subscribersIds: [string], notification: Notification) {
        const operations = subscribersIds.map(subscriberId => {
            return {
                updateOne: {
                    filter: { subscriberId: subscriberId },
                    update: { 
                        $push: { notifications: notification },
                        $setOnInsert: { subscriberId: subscriberId }
                    },
                    upsert: true
                }
            } as any
        });
        await this.subscribersRepository.bulkWrite(operations as Array<AnyBulkWriteOperation<any>>)
    }

    async markAsRead(subscriberId: string, notificationId: string) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId, "notifications._id": notificationId },
            { $set: {"notifications.$[notification].read": true}},
            { arrayFilters: [{ "notification._id": notificationId }]}
        )
    }

    async markManyRead(subscriberId: string, notificationsIds: [string]) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId, "notifications._id": notificationsIds },
            { $set: {"notifications.$[notification].read": true}},
            { arrayFilters: [{ "notification._id": notificationsIds }]}
        )
    }

    async markAllAsRead(subscriberId: string) {
        await this.subscribersRepository.updateMany(
            { subscriberId: subscriberId },
            { $set: {"notifications.$.read": true}},
        )
    }
}