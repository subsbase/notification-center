import { DynamicModule, Module } from '@nestjs/common';
import { ManagersModule } from '../managers/managers.module';
import { AuthController } from './auth/auth.controller';
import { SubjectsController } from './subject/subjects.controller';
import { NotificationsController } from './notification/notification.controller';
import { SubscribersController } from './subscriber/subscriber.controller';
import { TopicsController } from './topic/topic.controller';
import { HealthController } from './health/health.controller';

@Module({})
export class ControllersModule {
  static withConfig(dbConnection: string): DynamicModule {
    return {
      module: ControllersModule,
      imports: [ManagersModule.withConfig(dbConnection)],
      controllers: [
        SubjectsController,
        TopicsController,
        NotificationsController,
        SubscribersController,
        TopicsController,
        AuthController,
        HealthController,
      ],
    };
  }
}
