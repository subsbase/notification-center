import { Injectable } from '@nestjs/common';
import { ArchivedNotificationsRepository } from '../../repositories/archived-notifications/repositorty';
import { ArchivedNotification as SubscriberArchivedNotification } from '../../repositories/subscriber/archived-notification/schema'
import { Realm } from '../../repositories/realm/schema';

@Injectable()
export class ArchivedNotificationService {

    constructor(private readonly archivedNotificationsRepository: ArchivedNotificationsRepository) {}
    
    async archive(subscribers: Array<{
        subscriberId: string;
        realm: Realm;
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
