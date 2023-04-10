import { DynamicModule, Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { NotificationManager } from './notification/notification.manager';
import { SubjectManager } from './subject/subject.manager';
import { TopicsManager } from './topic/topics.manager';
import { SubscriberManager } from './subscriber/subscriber.manager';
import { EventsModule } from '../events/events.module';

@Module({})
export class ManagersModule {
    static withConfig(dbConnection: string) : DynamicModule {
        return {
            module: ManagersModule,
            imports: [ServicesModule.withDbonnection(dbConnection), EventsModule],
            providers: [SubjectManager,TopicsManager, NotificationManager, SubscriberManager],
            exports: [SubjectManager ,TopicsManager, NotificationManager, SubscriberManager]
        };
    }
}
