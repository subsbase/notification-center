import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { v4 as guid } from 'uuid';
import { BaseModel } from "../base-model";
import { HydratedDocument } from "mongoose";
import { SchemaOptions } from "../schema.options";

export type RealmDocument = HydratedDocument<Realm>;

@Schema(SchemaOptions)
export class Realm extends BaseModel {
    @Prop({ index: true, unique: true, required: true, default: `notifc_sk_${guid().replace('-','')}` })
    secret: string;
}

export const RealmSchema = SchemaFactory.createForClass(Realm);

