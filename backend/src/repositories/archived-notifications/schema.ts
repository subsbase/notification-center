import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SchemaOptions } from '../schema.options';
import { ArchivedNotification as SubscriberArchivedNotification } from '../subscriber/archived-notification/schema';
import { Subscriber } from '../subscriber/schema';

export type ArchivedNotificationDocument = HydratedDocument<ArchivedNotification>;

@Schema({ ...SchemaOptions, collection: 'archived-notifications'})
export class ArchivedNotification extends SubscriberArchivedNotification {
    @Prop({ required: true, type: String, ref: 'Subscriber' })    
    subscriber: Subscriber;

    @Prop({ required: true, ref: 'Realm' })
    realm: string;
}

export const ArchivedNotificationSchema = SchemaFactory.createForClass(ArchivedNotification);
