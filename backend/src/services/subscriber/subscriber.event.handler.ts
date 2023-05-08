import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { SubscriberService } from "./subscriber.service";


@Injectable()
export class SubscriberEventHandler {

    constructor(private readonly subscriberService: SubscriberService) {}

    @OnEvent('subscriber.joined')
    async handleSubscriberJoind(subscriberId: string) {
        await this.subscriberService.createIfNotExists(subscriberId)
    }
}