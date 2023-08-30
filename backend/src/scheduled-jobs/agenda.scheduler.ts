import { Job } from '@hokify/agenda';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NotificationManager } from '../managers/notification/notification.manager';
import { SchedulerManager } from '../managers/scheduler/scheduler.manager';
import { Notification } from '../repositories/subscriber/notification/schema';

@Injectable()
export class AgendaScheduler implements OnModuleInit {
  constructor(
    private readonly schedulerManager: SchedulerManager,
    private readonly notificationManager: NotificationManager,
  ) {}

  onModuleInit() {
    //define agenda jobs

    this.schedulerManager.defineJob(
      'unsnooze',
      async (job: Job<{ realm: string; subscriberId: string; notification: Notification }>) => {
        const data = job.attrs.data;
        Logger.log('Job ' + data);
        const notification = data.notification;

        let res = await this.notificationManager.notify(
          data.realm,
          notification.subject.toString(),
          notification.topicId,
          notification.actionUrl,
          [data.subscriberId],
          notification.title,
          notification.message,
          null as unknown as string,
          null as unknown as string,
        );
      },
    );
  }
}
