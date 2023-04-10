import { Model } from "mongoose";
import { BaseRepository } from "../base-repository";
import { Realm, RealmDocument as RealmDocument } from "./schema";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RealmRepository extends BaseRepository<RealmDocument,Realm> {

    constructor(
    @InjectModel(Realm.name)
    protected readonly model: Model<RealmDocument>) {
        super(model);
    } 
}