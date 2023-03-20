import { Prop } from '@nestjs/mongoose';
import { Types, Schema as MongoSchema } from 'mongoose';

export abstract class BaseModel {
  @Prop({
    _id: true,
    default: new Types.ObjectId(),
    type: MongoSchema.Types.ObjectId,
  })
  _id: string;
}
