import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaOptions } from '../../../schema.options';

@Schema(SchemaOptions)
export class NotificationTemplate {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  message: string
}