import { HydratedDocument, Schema as MongoSchema} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../base-model';
import { Realm } from '../realm/schema';

export type NotificationTemplateDocument = HydratedDocument<NotificationTemplate>;

@Schema({collection: 'notification-templates'})
export class NotificationTemplate extends BaseModel {
  @Prop({ required: true })
  template?: string;

  @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: 'Realm' })
  realm: Realm;

  @Prop({ type: MongoSchema.Types.Mixed })
  payload?: Record<string, unknown>;
}

export const NotificationTemplateSchema = SchemaFactory.createForClass(NotificationTemplate);
