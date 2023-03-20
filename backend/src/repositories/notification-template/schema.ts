import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../base-model';

export type NotificationTemplateDocument = HydratedDocument<NotificationTemplate>;

@Schema({collection: 'notification-templates'})
export class NotificationTemplate extends BaseModel {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true })
  template?: string;

  @Prop({ type: MongoSchema.Types.Mixed })
  payload?: any;
}

export const NotificationTemplateSchema = SchemaFactory.createForClass(NotificationTemplate);
