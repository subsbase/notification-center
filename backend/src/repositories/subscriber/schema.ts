import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../base-model';
import { SchemaOptions } from '../schema.options';
import { Realm } from '../realm/schema';
import { Notification, NotificationSchema } from './notification/schema';
import { ArchivedNotification, ArchivedNotificationSchema } from './archived-notification/schema';

export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema(SchemaOptions)
export class Subscriber extends BaseModel {
  @Prop({ index: true, unique: true, required: true, type: MongoSchema.Types.String })
  subscriberId: string;

  @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: 'Realm' })
  realm: Realm;

  @Prop({ type: MongoSchema.Types.Mixed })
  customData?: any;

  @Prop({ type: [NotificationSchema], default: new Array<Notification>()})
  notifications?: Array<Notification>;

  @Prop({ type: [ArchivedNotificationSchema], default: new Array<ArchivedNotification>() })
  archivedNotifications?: Array<ArchivedNotification>
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
