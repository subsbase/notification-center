import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { BaseModel } from '../base-model';
import { SchemaOptions } from '../schema.options';
import { Topic } from './topic/schema';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema(SchemaOptions)
export class Subject extends BaseModel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, ref: 'Realm' })
  realm: string;

  @Prop({ type: MongoSchema.Types.Map })
  topics: Map<string, Topic>
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
