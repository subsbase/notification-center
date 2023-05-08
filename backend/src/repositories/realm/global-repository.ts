import { Model } from "mongoose";
import { GlobalRepository } from "../base-global-repository";
import { Realm, RealmDocument as RealmDocument } from "./schema";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RealmGlobalRepository extends GlobalRepository<RealmDocument,Realm> {

    constructor(
    @InjectModel(Realm.name)
    protected readonly model: Model<RealmDocument>) {
        super(model);
    } 
}