import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { BaseModel } from '../base-model';
import { SchemaOptions } from '../schema.options';
import { Subject } from '../subject/schema';
import {NotificationTemplate} from "./notification-template/schema";

export type TopicDocument = HydratedDocument<Topic>;

@Schema(SchemaOptions)
export class Topic extends BaseModel {
  @Prop({ index: true, unique: true, required: true })
  event: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: 'Subject' })
  subject: Subject;

  @Prop({ type: NotificationTemplate })
  notificationTemplate?: NotificationTemplate;

  @Prop({ required: true })
  realm: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Topic' })
  parentTopic?: Topic;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
