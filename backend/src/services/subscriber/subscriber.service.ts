import { Injectable } from '@nestjs/common';
import { CreatedModel } from '../../repositories/helper-types';
import { SubscribersRepository } from '../../repositories/subscriber/repository';
import { Subscriber } from '../../repositories/subscriber/schema';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SubscriberService {

    constructor(private readonly subscriberRepository: SubscribersRepository) {}

    public createOrUpdate(subscriber: Subscriber) {
       return this.subscriberRepository.createOrUpdate(subscriber);
    }

    async create(subscriber: Subscriber) : Promise<CreatedModel> {
        return await this.subscriberRepository.create(subscriber);
    }

    // @OnEvent('subscriber.joined')
    async handleSubscriberJoind(payload: any) {
        //todo: make sure realm inclueded in payload
        await this.createOrUpdate({
            subscriberId: payload.subscriberId,
            realm: payload.realm,
            createdAt: new Date(),
            updatedAt: new Date(),
            _id: ''
        })
    }
}
