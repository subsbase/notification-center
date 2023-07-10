import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../base-model';
import { SchemaOptions } from '../schema.options';
import { Notification, NotificationSchema } from './notification/schema';
import { ArchivedNotification, ArchivedNotificationSchema } from './archived-notification/schema';

export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema(SchemaOptions)
export class Subscriber extends BaseModel {
  @Prop({ required: true, ref: 'Realm' })
  realm: string;

  @Prop({ type: MongoSchema.Types.Mixed })
  customData?: Record<string, string>;

  @Prop({ type: [NotificationSchema], default: new Array<Notification>() })
  notifications?: Array<Notification>;

  @Prop({ type: [ArchivedNotificationSchema], default: new Array<ArchivedNotification>() })
  archivedNotifications?: Array<ArchivedNotification>;

  totalCount: number;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
