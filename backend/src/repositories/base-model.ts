import { Prop } from '@nestjs/mongoose';

export abstract class BaseModel {
  @Prop({ type: String, alias: 'id' })
  protected _id: string;
  id: string;

  @Prop({ required: true, default: new Date().toUTCString(), type: Date })
  createdAt: Date;

  @Prop({ required: true, default: new Date().toUTCString(), type: Date })
  updatedAt: Date;
}
