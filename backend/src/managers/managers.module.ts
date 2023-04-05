import { DynamicModule, Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { NotificationManager } from './notification/notification.manager';
import { SubjectManager } from './subject/subject.manager';
import { TopicsManager } from './topic/topics.manager';
import { AuthManager } from './auth/auth.manager';

@Module({})
export class ManagersModule {
    static withConfig(dbConnection: string) : DynamicModule {
        return {
            module: ManagersModule,
            imports: [ServicesModule.withDbonnection(dbConnection)],
            providers: [SubjectManager,TopicsManager, NotificationManager, AuthManager],
            exports: [SubjectManager ,TopicsManager, NotificationManager, AuthManager]
        };
    }
}
