import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { BaseModel } from '../base-model';
import { SchemaOptions } from '../schema.options';
import { Subject } from '../subject/schema';
import { NotificationTemplate } from './notification-template/schema';

export type TopicDocument = HydratedDocument<Topic>;

@Schema(SchemaOptions)
export class Topic extends BaseModel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: String, ref: 'Subject' })
  subject: Subject;

  @Prop({ type: MongoSchema.Types.Map })
  notificationTemplates?: Map<string, NotificationTemplate>;

  @Prop({ required: true, ref: 'Realm' })
  realm: string;

  @Prop({ type: String, ref: 'Topic' })
  parentTopic?: Topic;

}

export const TopicSchema = SchemaFactory.createForClass(Topic);
