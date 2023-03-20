import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongoSchema } from 'mongoose';
import { Topic } from 'src/repositories/topic/schema';

@Schema()
export class Notification {
  @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: 'Topic' })
  topic: Topic;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: new Date().getUTCDate(), type: Date })
  createdAt: Date;

  @Prop({ required: true, default: false, type: Boolean })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
