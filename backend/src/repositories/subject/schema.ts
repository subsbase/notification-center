import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { BaseModel } from '../base-model';
import { SchemaOptions } from "../schema.options";

export type SubjectDocument = HydratedDocument<Subject>;

@Schema(SchemaOptions)
export class Subject extends BaseModel {
  @Prop({ index: true, required: true, unique: true })
  name: string;

  @Prop({ required: true })
  realm: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
