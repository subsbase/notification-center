import { Module } from '@nestjs/common';
import { ManagersModule } from '../managers/managers.module';
import { SubjectController } from './subject/subjects.controller';
import { NotificationController } from './notification/notification.controller';
import { SubscriberController } from './subscriber/subscriber.controller';
import { TopicController } from './topic/topic.controller';

@Module({
  imports: [ManagersModule],
  controllers: [SubjectController, TopicController, NotificationController, SubscriberController, TopicController],
})
export class ControllersModule {}
