import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../repositories/repositories.module';
import { NotificationTemplateService } from './notification-template/notification-template.service';
import { NotificationProcessor } from './notification/notification.processor';
import { NotificationService } from './notification/notification.service';
import { SubjectService } from './subject/subject.service';
import { SubscriberService } from './subscriber/subscriber.service';
import { TopicService } from './topic/topic.service';

@Module({
  imports: [RepositoriesModule],
  providers: [SubjectService, TopicService, SubscriberService, NotificationProcessor, NotificationService , NotificationTemplateService, TopicService],
  exports: [SubjectService, TopicService, NotificationService, NotificationTemplateService],
})
export class ServicesModule {}
