import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongoSchema, Types } from 'mongoose';
import { SchemaOptions } from '../../schema.options';
import { BaseModel } from '../../base-model';
import { Subject } from '../../subject/schema'; 

@Schema(SchemaOptions)
export class Notification extends BaseModel {
  @Prop({
    type: MongoSchema.Types.ObjectId,
    default: Types.ObjectId,
    alias: 'id',
  })
  protected declare _id: string; // override _id property with ObjectId type

  @Prop({ required: true, type: MongoSchema.Types.String, ref: 'Subject' })
  subject: Subject;

  @Prop({ required: true })
  topicId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  actionUrl: string;

  @Prop({ required: true, default: false, type: Boolean })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
