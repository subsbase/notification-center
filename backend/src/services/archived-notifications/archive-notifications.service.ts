import { Injectable } from '@nestjs/common';
import { ArchivedNotificationsGlobalRepository } from '../../repositories/archived-notifications/global-repositorty';
import { ArchivedNotification as SubscriberArchivedNotification } from '../../repositories/subscriber/archived-notification/schema'
import { SubscribersGlobalRepository } from '../../repositories/subscriber/global-repository';
import { Types } from 'mongoose';

@Injectable()
export class ArchiveNotificationService {

    constructor(
        private readonly archivedNotificationsRepository: ArchivedNotificationsGlobalRepository,
        private readonly subscribersGlobalRepository: SubscribersGlobalRepository) {}
    
    getNotificationsToArchive(thresholdDays: number) : Promise<Array<{
        subscriberId: string;
        realm: string;
        notificationsToArchive: Array<SubscriberArchivedNotification> | undefined;
    }>> {
        return this.subscribersGlobalRepository.aggregate([
            { $unwind: "$archivedNotifications" },
            { $match: { "archivedNotifications.archivedAt": { $lt: new Date(Date.now() - thresholdDays * 24 * 60 * 60 * 1000) } } },
            { $group:  { _id: "$_id", realm: { $first: "$realm" } , archivedNotifications: { $push: "$archivedNotifications" }  } }
        ]).then(aggregationResult => {
            
            this.subscribersGlobalRepository.bulkWrite(aggregationResult.map(subscriber => ({
                updateOne: {
                    filter: { _id: subscriber._id },
                    update: { 
                        $pull: { 
                            archivedNotifications: {
                                _id: { $in: subscriber.archivedNotifications?.map(archivedNotification => new Types.ObjectId(archivedNotification._id)) }
                            }
                        },
                    },
                }
            })))

            return aggregationResult.map(subsciber => ({
                subscriberId: subsciber._id,
                realm: subsciber.realm,
                notificationsToArchive: subsciber.archivedNotifications
            }))
        })
    }

    async archive(subscribers: Array<{
        subscriberId: string;
        realm: string;
        notificationsToArchive: Array<SubscriberArchivedNotification> | undefined;
    }>) : Promise<void> {
        await this.archivedNotificationsRepository.insertMany( 
            subscribers
                .flatMap(subscriber => subscriber.notificationsToArchive?.map(notificationToArchive => ({
                    subscriberId: subscriber.subscriberId,
                    realm: subscriber.realm,
                    ...notificationToArchive
                })) || [])
            , { ordered: false });
    }
}
