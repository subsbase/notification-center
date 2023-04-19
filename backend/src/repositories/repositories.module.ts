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


@Module({})
export class RepositoriesModule {
  static withUri(
    uri: string,
  ): DynamicModule {
    return {
      module: RepositoriesModule,
      imports: [    
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          {
            name: Realm.name,
            schema: RealmSchema
          },
          {
            name: Subject.name,
            schema: SubjectSchema,
          },
          {
            name: Topic.name,
            schema: TopicSchema,
          },
          {
            name: Subscriber.name,
            schema: SubscriberSchema,
          },
        ]),
      ],
      providers: [
        RealmRepository,
        SubjectsRepository,
        TopicsRepository,
        SubscribersRepository,
      ],
      exports: [
        RealmRepository,
        SubjectsRepository,
        TopicsRepository,
        SubscribersRepository,
      ],
    };
  }
}
