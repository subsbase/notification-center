import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongoSchema } from 'mongoose';
import { SchemaOptions } from '../../schema.options';
import { NotificationTemplate } from './notification-template/schema';

@Schema(SchemaOptions)
export class Topic {
  @Prop({ type: MongoSchema.Types.Map })
  notificationTemplates?: Map<string, NotificationTemplate>;
}