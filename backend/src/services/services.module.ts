import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../repositories/repositories.module';
import { NotificationTemplateService } from './notification-template/notification-template.service';
import { NotificationProcessor } from './notification/notification.processor';
import { NotificationService } from './notification/notification.service';
import { SubjectService } from './subject/subject.service';
import { SubscriberService } from './subscriber/subscriber.service';
import { TopicService } from './topic/topic.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenProcessor } from './auth/access.token.processor';

@Module({})
export class ServicesModule {
  static withDbonnection(uri: string): DynamicModule{
    return {
      module: ServicesModule,
      imports: [RepositoriesModule.withUri(uri), 
      JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { 
          expiresIn: '1d',
          issuer: process.env.JWT_ISSUER,
          audience: process.env.JWT_AUDIENCE,
        },
      })],
      providers: [SubjectService, TopicService, NotificationService, NotificationTemplateService, SubscriberService, AuthService, NotificationProcessor, AccessTokenProcessor],
      exports: [SubjectService, TopicService, NotificationService, NotificationTemplateService, SubscriberService, AuthService],
    }
  }
}
