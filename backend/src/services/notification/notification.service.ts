import { Types } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { NotificationProcessor } from './notification.processor';
import { SubscribersRepository } from '../../repositories/subscriber/repository';
import { Notification } from '../../repositories/subscriber/notification/schema'
import { Payload } from '../../types/global-types';
import { UpdatedModel } from '../../repositories/helper-types';
import { ArchivedNotification } from '../../repositories/subscriber/archived-notification/schema';
import { Topic } from "../../repositories/topic/schema";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { 
    NotificationArchived,
    NotificationRead,
    NotificationUnarchived,
    NotificationUnread,
    NotificationsRead,
    NotificationsUnread 
} from '../../internal-events/notification';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationProcessor: NotificationProcessor, 
        private readonly subscribersRepository: SubscribersRepository,
        private readonly eventEmitter: EventEmitter2
        ) {}


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

        return subscribers[0]?.notifications;
    }


    async  getArchivedNotifications(subscriberId: string, pageNum: number, pageSize: number) : Promise<Array<ArchivedNotification> | undefined> {
        const subscribers =  await this.subscribersRepository.aggregate ([
            { $match: { subscriberId: subscriberId } },
            {
                $project: {
                    archivedNotifications: { $slice: ['$archivedNotifications', (pageNum - 1) * pageSize, pageSize] }
                }
            },
            {
                $unwind: '$archivedNotifications'
            },
            {
                $lookup: {
                    from: 'topics',
                    let: { referenceId: '$archivedNotifications.topic' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$referenceId'] } } }
                    ],
                    as: 'topic'
                }
            },
            {
                $addFields: {
                    'archivedNotifications.topic': { $arrayElemAt: ['$topic', 0] }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    archivedNotifications: { $push: '$archivedNotifications' }
                }
            }
        ]);

        return subscribers[0]?.archivedNotifications;
    }
    

    async archive(subscriberId: string, notificationsIds: Array<string>): Promise<UpdatedModel> {
        const result = await this.subscribersRepository.aggregate([
            {
                $match: { subscriberId },
            },
            {
                $project: {
                    notifications: {
                        $filter: {
                            input: '$notifications',
                            as: 'notification',
                            cond: {
                                $in: [
                                    '$$notification._id',
                                    notificationsIds.map((oid) => new Types.ObjectId(oid)),
                                ],
                            },
                        },
                    },
                },
            },
            {
                $group: {
                    _id: '$_id',
                    notifications: { $push: '$notifications' },
                },
            }
        ]).then((aggregationResult) => {
            const notificationsToArchive = { $reduce: { input: aggregationResult[0].notifications, initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } };
            return this.subscribersRepository.updateOne(
                { subscriberId },
                [
                    {
                        $set: {
                            archivedNotifications: {
                                $cond: {
                                    if: { $eq: ['$archivedNotifications', null] },
                                    then: { $map: { input: notificationsToArchive, in: { $mergeObjects: ['$$this', { archivedAt: new Date() }] } } },
                                    else: { $concatArrays: ['$archivedNotifications', { $map: { input: notificationsToArchive, in: { $mergeObjects: ['$$this', { archivedAt: new Date() }] } } }] },
                                },
                            },
                        },
                    },
                    {
                        $set: {
                            notifications: {
                                $filter: {
                                    input: '$notifications',
                                    as: 'notification',
                                    cond: {
                                        $not: {
                                            $in: [
                                                '$$notification._id',
                                                notificationsIds.map((oid) => new Types.ObjectId(oid)),
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                ],
                { setDefaultsOnInsert: true }
            );
        });

        this.eventEmitter.emit('notification.archived', new NotificationArchived(
            subscriberId,
            notificationsIds))

        return result;
    }

    async unarchive(subscriberId: string, archivedNotificationsIds: Array<string>) : Promise<UpdatedModel> {
        const result = await this.subscribersRepository.aggregate([
            {
                $match: { subscriberId },
            },
            {
                $project: {
                    archivedNotifications: {
                        $filter: {
                            input: '$archivedNotifications',
                            as: 'archivedNotification',
                            cond: {
                                $in: [
                                    '$$archivedNotification._id',
                                    archivedNotificationsIds.map((oid) => new Types.ObjectId(oid)),
                                ],
                            },
                        },
                    },
                },
            },
            {
                $unset: ["archivedNotifications.archivedAt"]
            },
            {
                $group: {
                    _id: '$_id',
                    archivedNotifications: { $push: '$archivedNotifications' },
                },
            }
        ]).then((aggregationResult) => {
            const notificationsToUnarchive = { $reduce: { input: aggregationResult[0].archivedNotifications, initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } };
            return this.subscribersRepository.updateOne(
                { subscriberId },
                [
                    {
                        $set: {
                            archivedNotifications: { 
                                $filter: { 
                                    input: '$archivedNotifications',
                                    as: 'archivedNotification',
                                    cond: {
                                            $not: {
                                                $in: ['$$archivedNotification._id',
                                                archivedNotificationsIds.map((oid) => new Types.ObjectId(oid))
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                    },
                    {
                        $set: {
                            notifications: { 
                                $concatArrays: [
                                    "$notifications",
                                    {
                                        $map: {
                                          input: notificationsToUnarchive,
                                          as: "notification",
                                          in: "$$notification",
                                        },
                                    },
                                ]  
                            },
                        },
                    },
                ],
            );
        });

        this.eventEmitter.emit('notification.unarchived', new NotificationUnarchived(
            subscriberId,
            archivedNotificationsIds))

        return result;
    }

    buildNotification(topic: Topic, content: string, actionUrl: string): Notification {
        return this.notificationProcessor.build(topic, content, actionUrl);
    }

    compileContent(template: string | undefined, payload: Payload): string {
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
            }
        }))
    }

    async markAsRead(subscriberId: string, notificationId: string) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId, "notifications._id": notificationId },
            { $set: { "notifications.$[notification].read": true } },
            { arrayFilters: [{ "notification._id": notificationId }] }
        )

        this.eventEmitter.emit('notification.read', new NotificationRead(
            subscriberId,
            [notificationId]))
    }

    async markAsUnRead(subscriberId: string, notificationId: string) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId, "notifications._id": notificationId },
            { $set: { "notifications.$[notification].read": false } },
            { arrayFilters: [{ "notification._id": notificationId }] }
        )
        
        this.eventEmitter.emit('notification.read', new NotificationRead(
            subscriberId,
            [notificationId]))
    }

    async markManyAsRead(subscriberId: string, notificationsIds: Array<string>) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId, "notifications._id": notificationsIds },
            { $set: { "notifications.$[notification].read": true } },
            { arrayFilters: [{ "notification._id": notificationsIds }] }
        )

        this.eventEmitter.emit('notification.read', new NotificationRead(
            subscriberId,
            notificationsIds))
    }

    async markAllAsRead(subscriberId: string) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId },
            { $set: {"notifications.$[].read": true}},
        )

        this.eventEmitter.emit('notifications.read', new NotificationsRead(subscriberId))
    }

    async markManyAsUnRead(subscriberId: string, notificationsIds: Array<string>) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId, "notifications._id": notificationsIds },
            { $set: {"notifications.$[notification].read": false}},
            { arrayFilters: [{ "notification._id": notificationsIds }]}
        )

        this.eventEmitter.emit('notification.unread', new NotificationUnread(
            subscriberId,
            notificationsIds))
    }

    async markAllAsUnRead(subscriberId: string) {
        await this.subscribersRepository.updateOne(
            { subscriberId: subscriberId },
            { $set: {"notifications.$[].read": false}},
        )

        this.eventEmitter.emit('notifications.unread', new NotificationsUnread(subscriberId))
    }
}