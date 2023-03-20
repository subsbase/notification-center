import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './subject/schema';
import { SubjectsRepository } from './subject/repository';
import { Topic, TopicSchema } from './topic/schema';
import { TopicsRepository } from './topic/repository';
import {
  NotificationTemplate,
  NotificationTemplateSchema,
} from './notification-template/schema';
import { NotificationsTemplatesRepository } from './notification-template/repository';
import { Subscriber, SubscriberSchema } from './subscriber/schema';
import { SubscribersRepository } from './subscriber/repository';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
      {
        name: Topic.name,
        schema: TopicSchema,
      },
      {
        name: NotificationTemplate.name,
        schema: NotificationTemplateSchema,
      },
      {
        name: Subscriber.name,
        schema: SubscriberSchema,
      },
    ]),
  ],
  providers: [
    SubjectsRepository,
    TopicsRepository,
    NotificationsTemplatesRepository,
    SubscribersRepository,
  ],
  exports: [
    SubjectsRepository,
    TopicsRepository,
    NotificationsTemplatesRepository,
    SubscribersRepository,
  ],
})
export class RepositoriesModule {}
