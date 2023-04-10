import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { BaseModel } from '../base-model';
import { SchemaOptions } from "../schema.options";
import { Realm } from '../realm/schema';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema(SchemaOptions)
export class Subject extends BaseModel {
  @Prop({ index: true, required: true, unique: true })
  name: string;

  @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: 'Realm' })
  realm: Realm;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
