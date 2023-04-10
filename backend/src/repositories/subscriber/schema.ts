import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification/schema';
import { BaseModel } from '../base-model';
import { SchemaOptions } from '../schema.options';
import { Realm } from '../realm/schema';

export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema(SchemaOptions)
export class Subscriber extends BaseModel {
  @Prop({ index: true, unique: true, required: true, type: MongoSchema.Types.String })
  subscriberId: string;

  @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: 'Realm' })
  realm: Realm;

  @Prop({ type: MongoSchema.Types.Mixed })
  customData?: any;

  @Prop({ type: [NotificationSchema] })
  notifications?: Array<Notification>;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
