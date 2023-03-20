import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification/schema';
import { BaseModel } from '../base-model';

export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema()
export class Subscriber extends BaseModel {
  @Prop({ required: true, type: MongoSchema.Types.String })
  subscriberId: string;

  @Prop({ type: MongoSchema.Types.Mixed })
  customData?: any;

  @Prop({ type: [NotificationSchema] })
  notifications?: Notification[];
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
