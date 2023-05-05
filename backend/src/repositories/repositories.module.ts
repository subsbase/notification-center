import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './subject/schema';
import { SubjectsRepository } from './subject/repository';
import { Topic, TopicSchema } from './topic/schema';
import { TopicsRepository } from './topic/repository';
import { Subscriber, SubscriberSchema } from './subscriber/schema';
import { SubscribersRepository } from './subscriber/repository';
import { Realm, RealmSchema } from './realm/schema';
import { RealmRepository } from './realm/repository';
import { ArchivedNotification, ArchivedNotificationSchema } from './archived-notifications/schema';
import { ArchivedNotificationsRepository } from './archived-notifications/repositorty';
import { SchemaModule } from '../schema/schema.module';
import { SchemaFactory } from '../schema/schema.factory';

@Module({})
export class RepositoriesModule {
  static withUri(
    uri: string,
  ): DynamicModule {
    return {
      module: RepositoriesModule,
      imports: [    
        MongooseModule.forRoot(uri),
        MongooseModule.forFeatureAsync([
          {
            name: Realm.name,
            useFactory: () => RealmSchema
          },
          {
            name: Subject.name,
            imports: [SchemaModule],
            inject: [SchemaFactory],
            useFactory: (schemaFactory: SchemaFactory) => {
              return schemaFactory.create(SubjectSchema);
            }
          },
          {
            name: Topic.name,
            imports: [SchemaModule],
            inject: [SchemaFactory],
            useFactory: (schemaFactory: SchemaFactory) => {
              return schemaFactory.create(TopicSchema);
            }
          },
          {
            name: Subscriber.name,
            imports: [SchemaModule],
            inject: [SchemaFactory],
            useFactory: (schemaFactory: SchemaFactory) => {
              return schemaFactory.create(SubscriberSchema);
            }
          },
          {
            name: ArchivedNotification.name,
            imports: [SchemaModule],
            inject: [SchemaFactory],
            useFactory: (schemaFactory: SchemaFactory) => {
              return schemaFactory.create(ArchivedNotificationSchema);
            }
          }
        ])
      ],
      providers: [
        RealmRepository,
        SubjectsRepository,
        TopicsRepository,
        SubscribersRepository,
        ArchivedNotificationsRepository
      ],
      exports: [
        RealmRepository,
        SubjectsRepository,
        TopicsRepository,
        SubscribersRepository,
        ArchivedNotificationsRepository
      ],
    };
  }
}
