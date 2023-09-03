import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../repositories/repositories.module';
import { NotificationProcessor } from './notification/notification.processor';
import { NotificationService } from './notification/notification.service';
import { SubjectService } from './subject/subject.service';
import { SubscriberService } from './subscriber/subscriber.service';
import { TopicService } from './topic/topic.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenProcessor } from './auth/access.token.processor';
import { ArchiveNotificationService } from './archived-notifications/archive.notifications.service';
import { InternalEventsModule } from '../internal-events/internal.events.module';
import { RealmService } from './realm/realm.service';
import { SubscriberEventHandler } from './subscriber/subscriber.event.handler';
import { TopicProcessor } from './topic/topic.processor';
import { SubjectProcessor } from './subject/subject.processor';
import { ArchivedNotificationProcessor } from './archived-notifications/archived.notification.processor';
import { Agenda } from '@hokify/agenda';
import { SnoozeNotificationsService } from './snoozed-notification/snooze-notifications.service';
@Module({})
export class ServicesModule {
  static withDbConnection(uri: string): DynamicModule {
    const agenda = new Agenda({ db: { address: uri, collection: 'scheduled-jobs' }, sort: { Priority: -1 } });

    return {
      module: ServicesModule,
      imports: [
        RepositoriesModule.withUri(uri),
        InternalEventsModule,
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRIN,
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE,
          },
        }),
      ],
      providers: [
        SubjectProcessor,
        SubjectService,
        TopicProcessor,
        TopicService,
        NotificationService,
        SubscriberService,
        AuthService,
        NotificationProcessor,
        AccessTokenProcessor,
        ArchiveNotificationService,
        RealmService,
        SubscriberEventHandler,
        ArchivedNotificationProcessor,
        SnoozeNotificationsService,
        {
          provide: Agenda,
          useValue: agenda,
        },
      ],
      exports: [
        SubjectService,
        TopicService,
        NotificationService,
        SubscriberService,
        AuthService,
        ArchiveNotificationService,
        RealmService,
        SnoozeNotificationsService,
        {
          provide: Agenda,
          useValue: agenda,
        },
      ],
    };
  }
}
