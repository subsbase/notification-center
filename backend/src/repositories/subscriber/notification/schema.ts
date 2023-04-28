import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongoSchema } from 'mongoose';
import { SchemaOptions } from '../../schema.options';
import { BaseModel } from '../../base-model';
import { Topic } from '../../topic/schema';

@Schema(SchemaOptions)
export class Notification extends BaseModel {
  @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: 'Topic' })
  topic: Topic;

  @Prop({ required: true })
  content: string;

  @Prop()
  actionUrl: string;

  @Prop({ required: true, default: false, type: Boolean })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
