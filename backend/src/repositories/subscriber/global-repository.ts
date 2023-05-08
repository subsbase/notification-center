import { Injectable } from "@nestjs/common";
import { GlobalRepository } from "../base-global-repository";
import { Subscriber, SubscriberDocument } from "./schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class SubscribersGlobalRepository extends GlobalRepository<SubscriberDocument, Subscriber> {

    constructor(@InjectModel(Subscriber.name)
        protected readonly model: Model<SubscriberDocument>){
       super(model)
    }
}