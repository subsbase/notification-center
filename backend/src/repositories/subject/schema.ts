import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { BaseModel } from '../base-model';
import { SchemaOptions } from '../schema.options';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema(SchemaOptions)
export class Subject extends BaseModel {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, ref: 'Realm' })
  realm: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
