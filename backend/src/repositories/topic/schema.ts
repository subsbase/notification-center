import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { BaseModel } from '../base-model';
import { Subject } from '../subject/schema';

export type TopicDocument = HydratedDocument<Topic>;

@Schema()
export class Topic extends BaseModel {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: 'Subject' })
  subject: Subject;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Topic' })
  parentTopic?: Topic;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
