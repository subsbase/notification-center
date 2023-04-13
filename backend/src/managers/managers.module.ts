import { DynamicModule, Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { NotificationManager } from './notification/notification.manager';
import { SubjectManager } from './subject/subject.manager';
import { TopicsManager } from './topic/topics.manager';
import { AuthManager } from './auth/auth.manager';
import { SubscriberManager } from './subscriber/subscriber.manager';
import { EventsModule } from '../events/events.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthManager } from './health/health.manager';

@Module({})
export class ManagersModule {
    static withConfig(dbConnection: string) : DynamicModule {
        return {
            module: ManagersModule,
            imports: [ServicesModule.withDbonnection(dbConnection), EventsModule, TerminusModule],
            providers: [SubjectManager, TopicsManager, NotificationManager, SubscriberManager, AuthManager, HealthManager],
            exports: [SubjectManager ,TopicsManager, NotificationManager, SubscriberManager, AuthManager, HealthManager]
        };
    }
}
