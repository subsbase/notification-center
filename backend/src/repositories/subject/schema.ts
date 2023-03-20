import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from '../base-model';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema()
export class Subject extends BaseModel {
  @Prop({ required: true, unique: true, index: true })
  name: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
