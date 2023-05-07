import { DynamicModule, Module, Scope } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './subject/schema';
import { SubjectsRepository } from './subject/repository';
import { Topic, TopicSchema } from './topic/schema';
import { TopicsRepository } from './topic/repository';
import { Subscriber, SubscriberSchema } from './subscriber/schema';
import { SubscribersRepository } from './subscriber/repository';
import { Realm, RealmSchema } from './realm/schema';
import { RealmGlobalRepository } from './realm/global-repository';
import { ArchivedNotification, ArchivedNotificationSchema } from './archived-notifications/schema';
import { ArchivedNotificationsGlobalRepository } from './archived-notifications/global-repositorty';
import { SchemaModule } from '../schema/schema.module';
import { SchemaFactory } from '../schema/schema.factory';
import { RepositoryFactory } from 'src/repository-factory/repository.factory';
import { RepositoryFactoryModule } from 'src/repository-factory/repository.factory.module';
import { SubscribersGlobalRepository } from './subscriber/global-repository';

@Module({})
export class RepositoriesModule {
  static withUri(
    uri: string,
  ): DynamicModule {
    return {
      module: RepositoriesModule,
      imports: [    
        RepositoryFactoryModule,
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
        RealmGlobalRepository,
        {
          provide: SubjectsRepository,
          inject: [RepositoryFactory],
          useFactory: (repositoryFactory: RepositoryFactory) => {
            return repositoryFactory.create(SubjectsRepository, Subject.name)
          }
        },
        {
          provide: TopicsRepository,
          inject: [RepositoryFactory],
          useFactory: (repositoryFactory: RepositoryFactory) => {
            return repositoryFactory.create(TopicsRepository, Topic.name)
          }
        },
        {
          provide: SubscribersRepository,
          inject: [RepositoryFactory],
          useFactory: (repositoryFactory: RepositoryFactory) => {
            return repositoryFactory.create(SubscribersRepository, Subscriber.name)
          }
        },
        ArchivedNotificationsGlobalRepository,
        SubscribersGlobalRepository
      ],
      exports: [
        RealmGlobalRepository,
        SubjectsRepository,
        TopicsRepository,
        SubscribersRepository,
        ArchivedNotificationsGlobalRepository,
        SubscribersGlobalRepository
      ],
    };
  }
}
