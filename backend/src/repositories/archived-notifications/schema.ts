import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { SchemaOptions } from '../schema.options';
import { ArchivedNotification as SubscriberArchivedNotification } from '../subscriber/archived-notification/schema';
import { Realm } from '../realm/schema';

export type ArchivedNotificationDocument = HydratedDocument<ArchivedNotification>;

@Schema({ ...SchemaOptions, collection: 'archived-notifications'})
export class ArchivedNotification extends SubscriberArchivedNotification {
    @Prop({ required: true, type: MongoSchema.Types.String })
    subscriberId: string;
  
    @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: 'Realm' })
    realm: Realm;
}

export const ArchivedNotificationSchema = SchemaFactory.createForClass(ArchivedNotification);
