import { DynamicModule, Module } from '@nestjs/common';
import { ManagersModule } from '../managers/managers.module';
import { SubjectController } from './subject/subjects.controller';
import { NotificationController } from './notification/notification.controller';
import { SubscriberController } from './subscriber/subscriber.controller';
import { TopicController } from './topic/topic.controller';
import { AuthController } from './auth/auth.controller';

@Module({})
export class ControllersModule {
  static withConfig(dbConnection:string) : DynamicModule {
    return {
      module: ControllersModule,
      imports: [ManagersModule.withConfig(dbConnection)],
      controllers: [SubjectController, TopicController, NotificationController, SubscriberController, TopicController, AuthController],
    }
  }
}
