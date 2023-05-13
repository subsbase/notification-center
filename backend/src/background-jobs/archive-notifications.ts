import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArchiveNotificationService } from '../services/archived-notifications/archive.notifications.service';

@Injectable()
export class ArchiveNotificationsTask {
  private readonly logger = new Logger(ArchiveNotificationsTask.name);

  DEFAULT_THREASHOLD = '7';

  constructor(
    private readonly archiveNotificationService: ArchiveNotificationService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'archive-notifications-task',
  })
  async archiveNotifications() {
    try {
      this.logger.log(`Start ${ArchiveNotificationsTask.name} at ${new Date().toDateString()}`);
      const thresholdDays = this.configService.get<string>('ARCHIVE_THRESHOLD_DAYS') ?? this.DEFAULT_THREASHOLD;
      const subscribersWithNotificationsToArchive = await this.archiveNotificationService.getNotificationsToArchive(
        Number.parseInt(thresholdDays),
      );
      this.logger.log(
        `Found ${subscribersWithNotificationsToArchive.length} subscribers with notifications need to be archived`,
      );

      await this.archiveNotificationService.archive(subscribersWithNotificationsToArchive);
      this.logger.log('Notifications archived successfully');
    } catch (err) {
      this.logger.error('Unable to archive notifications');
      this.logger.error(err);
    }
  }
}
