import { Job } from '@hokify/agenda';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Console } from 'console';
import { NotificationManager } from 'src/managers/notification/notification.manager';
import { SchedulerManager } from 'src/managers/scheduler/scheduler.manager';
import { Notification } from 'src/repositories/subscriber/notification/schema';

@Injectable()
export class AgendaScheduler implements OnModuleInit {
  constructor(
    private readonly schedulerManager: SchedulerManager,
    private readonly notificationManager: NotificationManager,
  ) {}

  onModuleInit() {
    //define agenda jobs
    Logger.log('defining job');
    this.schedulerManager.defineJob(
      'unsnooze',
      async (job: Job<{ realm: string; subscriberId: string; notification: Notification }>) => {
        Logger.log('Entered define Job function');
        const data = job.attrs.data;
        const notification = data.notification;

        this.notificationManager.notify(
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

        Logger.log('Job done ');
      },
    );
  }
}
