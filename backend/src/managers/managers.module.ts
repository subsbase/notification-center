import { Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { NotificationManager } from './notification/notification.manager';
import { SubjectManager } from './subject/subject.manager';
import { SubscribersManager } from './subscriber/subscriber.manager';
import { TopicsManager } from './topic/topics.manager';

@Module({
    imports: [ServicesModule],
    providers: [SubscribersManager, SubjectManager,TopicsManager, NotificationManager],
    exports: [SubscribersManager, SubjectManager ,TopicsManager, NotificationManager]
})
export class ManagersModule {}
