import { Injectable } from "@nestjs/common";
import { CreatedModel } from "../../repositories/helper-types";
import { Subscriber } from "../../repositories/subscriber/schema";
import { SubscriberService } from "../../services/subscriber/subscriber.service";

@Injectable()
export class SubscriberManager {
    constructor(private readonly subscriberService: SubscriberService) {}
    async create(subscriber: Subscriber) : Promise<CreatedModel> {
        return await this.subscriberService.create(subscriber);
    }
}