import { HydratedDocument, Schema as MongoSchema} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NotificationTemplateDocument = HydratedDocument<NotificationTemplate>;

@Schema()
export class NotificationTemplate {
  @Prop({ required: true })
  template?: string;
}

export const NotificationTemplateSchema = SchemaFactory.createForClass(NotificationTemplate);
