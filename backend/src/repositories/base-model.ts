import { Prop } from '@nestjs/mongoose';
import { Types, Schema as MongoSchema } from 'mongoose';

export abstract class BaseModel {
  @Prop({
    _id: true,
    type: MongoSchema.Types.ObjectId, 
    default: Types.ObjectId,
  })
  _id: string;

  @Prop({ required: true, default: new Date().toUTCString(), type: Date })
  createdAt: Date;

  @Prop({ required: true, default: new Date().toUTCString(), type: Date })
  updatedAt: Date;
}
