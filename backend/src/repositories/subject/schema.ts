import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from '../base-model';
import { SchemaOptions } from "../schema.options";

export type SubjectDocument = HydratedDocument<Subject>;

@Schema(SchemaOptions)
export class Subject extends BaseModel {
  @Prop({ index: true, required: true, unique: true })
  name: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
