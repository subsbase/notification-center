import { Schema } from '@nestjs/mongoose/dist/decorators/schema.decorator';
import { Prop } from '@nestjs/mongoose/dist/decorators/prop.decorator';
import { SchemaFactory } from '@nestjs/mongoose/dist/factories/schema.factory';
import { SchemaOptions } from '../../schema.options';
import { Notification } from '../notification/schema';

@Schema(SchemaOptions)
export class ArchivedNotification extends Notification {
  @Prop({ required: true, default: () => new Date().toISOString(), type: Date })
  archivedAt: Date;
}

export const ArchivedNotificationSchema = SchemaFactory.createForClass(ArchivedNotification);
