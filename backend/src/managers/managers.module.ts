import { Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { NotificationManager } from './notification/notification.manager';
import { SubjectManager } from './subject/subject.manager';
import { TopicsManager } from './topic/topics.manager';

@Module({
    imports: [ServicesModule],
    providers: [SubjectManager,TopicsManager, NotificationManager],
    exports: [SubjectManager ,TopicsManager, NotificationManager]
})
export class ManagersModule {}
