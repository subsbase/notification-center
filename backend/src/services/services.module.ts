import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../repositories/repositories.module';
import { NotificationTemplateService } from './notification-template/notification-template.service';
import { NotificationProcessor } from './notification/notification.processor';
import { NotificationService } from './notification/notification.service';
import { SubjectService } from './subject/subject.service';
import { SubscriberService } from './subscriber/subscriber.service';
import { TopicService } from './topic/topic.service';

@Module({})
export class ServicesModule {
  static withDbonnection(uri: string): DynamicModule{
    return {
      module: ServicesModule,
      imports: [RepositoriesModule.withUri(uri)],
      providers: [SubjectService, TopicService, SubscriberService, NotificationProcessor, NotificationService , NotificationTemplateService, TopicService],
      exports: [SubjectService, TopicService, NotificationService, NotificationTemplateService, SubscriberService]
    }
  }
}
