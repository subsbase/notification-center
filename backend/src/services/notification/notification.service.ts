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
    ) { }


    async getNotifications(subscriberId: string, pageNum: number, pageSize: number) : Promise<Array<Notification> | undefined> {
        const subscribers =  await this.subscribersRepository.aggregate ([
            { $match: { subscriberId: subscriberId } },
            {
                $project: {
                    notifications: { $slice: ['$notifications', (pageNum - 1) * pageSize, pageSize] }
                }
            },
            {
                $unwind: '$notifications'
            },
            {
                $lookup: {
                    from: 'topics',
                    let: { referenceId: '$notifications.topic' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$referenceId'] } } }
                    ],
                    as: 'topic'
                }
            },
            {
                $addFields: {
                    'notifications.topic': { $arrayElemAt: ['$topic', 0] }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    notifications: { $push: '$notifications' }
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
            { $push: { notifications: notification } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }

    async notifyAll(subscribersIds: Array<string>, notification: Notification) {
        await this.subscribersRepository.bulkWrite(subscribersIds.map(subscriberId => {
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
        }))
    }

    async markAsRead(subscriberId: string, notificationId: string) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId, "notifications._id": notificationId },
            { $set: { "notifications.$[notification].read": true } },
            { arrayFilters: [{ "notification._id": notificationId }] }
        )
    }

    async markAsUnRead(subscriberId: string, notificationId: string) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId, "notifications._id": notificationId },
            { $set: { "notifications.$[notification].read": false } },
            { arrayFilters: [{ "notification._id": notificationId }] }
        )
    }

    async markManyRead(subscriberId: string, notificationsIds: Array<string>) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId, "notifications._id": notificationsIds },
            { $set: { "notifications.$[notification].read": true } },
            { arrayFilters: [{ "notification._id": notificationsIds }] }
        )
    }

    async markAllAsRead(subscriberId: string) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId },
            { $set: { "notifications.$[].read": true } },
        )
    }
}