import { DynamicModule, Module, Scope } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './subject/schema';
import { SubjectsRepository, SubjectsRepositoryFactory } from './subject/repository';
import { Subscriber, SubscriberSchema } from './subscriber/schema';
import { SubscribersRepository, SubscribersRepositoryFactory } from './subscriber/repository';
import { Realm, RealmSchema } from './realm/schema';
import { RealmGlobalRepository } from './realm/global-repository';
import { ArchivedNotification, ArchivedNotificationSchema } from './archived-notifications/schema';
import { ArchivedNotificationsGlobalRepository } from './archived-notifications/global-repositorty';
import { SchemaModule } from '../schema/schema.module';
import { SchemaFactory } from '../schema/schema.factory';
import { RepositoryFactoryBuilder } from '../repository-factory/repository-factory.builder';
import { RepositoryFactoryModule } from '../repository-factory/repository-factory.module';
import { SubscribersGlobalRepository } from './subscriber/global-repository';

@Module({})
export class RepositoriesModule {
  static withUri(uri: string): DynamicModule {
    return {
      module: RepositoriesModule,
      imports: [
        RepositoryFactoryModule,
        MongooseModule.forRoot(uri),
        MongooseModule.forFeatureAsync([
          {
            name: Realm.name,
            useFactory: () => RealmSchema,
          },
          {
            name: Subject.name,
            imports: [SchemaModule],
            inject: [SchemaFactory],
            useFactory: (schemaFactory: SchemaFactory) => {
              return schemaFactory.create(SubjectSchema);
            },
          },
          {
            name: Subscriber.name,
            imports: [SchemaModule],
            inject: [SchemaFactory],
            useFactory: (schemaFactory: SchemaFactory) => {
              return schemaFactory.create(SubscriberSchema);
            },
          },
          {
            name: ArchivedNotification.name,
            imports: [SchemaModule],
            inject: [SchemaFactory],
            useFactory: (schemaFactory: SchemaFactory) => {
              return schemaFactory.create(ArchivedNotificationSchema);
            },
          },
        ]),
      ],
      providers: [
        RealmGlobalRepository,
        {
          provide: SubjectsRepositoryFactory,
          inject: [RepositoryFactoryBuilder],
          useFactory: (repositoryFactoryBuilder: RepositoryFactoryBuilder) => {
            return repositoryFactoryBuilder.build(Subject.name, SubjectsRepository, SubjectsRepositoryFactory);
          },
        },
        {
          provide: SubscribersRepositoryFactory,
          inject: [RepositoryFactoryBuilder],
          useFactory: (repositoryFactoryBuilder: RepositoryFactoryBuilder) => {
            return repositoryFactoryBuilder.build(Subscriber.name, SubscribersRepository, SubscribersRepositoryFactory);
          },
        },
        ArchivedNotificationsGlobalRepository,
        SubscribersGlobalRepository,
      ],
      exports: [
        RealmGlobalRepository,
        SubjectsRepositoryFactory,
        SubscribersRepositoryFactory,
        ArchivedNotificationsGlobalRepository,
        SubscribersGlobalRepository,
      ],
    };
  }
}
