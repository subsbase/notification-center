import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArchivedNotificationService } from '../services/archived-notifications/archived-notifications.service';
import { NotificationService } from '../services/notification/notification.service';

@Injectable()
export class ArchiveNotificationsTask {

  private readonly logger = new Logger(ArchiveNotificationsTask.name);

    constructor(
        private readonly notificationsService: NotificationService,
        private readonly archivedNotificationService: ArchivedNotificationService,
        private readonly configService: ConfigService) { }

    @Cron(CronExpression.EVERY_WEEKEND, {
        name: 'archive-notifications-task'
    })
    async archiveNotifications() {
        try{
            this.logger.log(`Start ${ArchiveNotificationsTask.name} at ${new Date().toDateString()}`);
            const thresholdDays = this.configService.get<number>('ARCHIVE_THRESHOLD_DAYS') || 7;
            const subscribersWithNotificationsToArchive = await this.notificationsService.getNotificationsToArchive(thresholdDays);
            this.logger.log(`Found ${subscribersWithNotificationsToArchive.length} subscribers with notifications need to be archived`);
            
            await this.archivedNotificationService.archive(subscribersWithNotificationsToArchive);
            this.logger.log('Notifications archived successfully');
        }catch(err){
            this.logger.error('Unable to archive notifications')
            this.logger.error(err)
        }
    }
}