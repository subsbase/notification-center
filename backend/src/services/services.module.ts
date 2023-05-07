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
import { ArchiveNotificationService } from './archived-notifications/archive-notifications.service';
import { InternalEventsModule } from '../internal-events/internal.events.module';
import { RealmService } from './realm/realm.service';
import { SubscriberEventHandler } from './subscriber/subscriber.event.handler';

@Module({})
export class ServicesModule {
  static withDbonnection(uri: string): DynamicModule{
    return {
      module: ServicesModule,
      imports: [RepositoriesModule.withUri(uri), 
        InternalEventsModule,
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { 
            expiresIn: '1d',
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE,
          },
        })],
      providers: [SubjectService, TopicService, NotificationService, SubscriberService, AuthService, NotificationProcessor, AccessTokenProcessor, ArchiveNotificationService, RealmService, SubscriberEventHandler],
      exports: [SubjectService, TopicService, NotificationService, SubscriberService, AuthService, ArchiveNotificationService, RealmService],
    }
  }
}
