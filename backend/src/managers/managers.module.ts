import { Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { NotificationManager } from './notification/notification.manager';
import { SubscribersManager } from './subscriber/subscriber.manager';
import { TopicsManager } from './topic/topics.manager';

@Module({
    imports: [ServicesModule],
    providers: [SubscribersManager, TopicsManager, NotificationManager],
    exports: [SubscribersManager,TopicsManager, NotificationManager]
})
export class ManagersModule {}
