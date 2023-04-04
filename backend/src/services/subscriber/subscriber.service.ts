import { Injectable } from '@nestjs/common';
import { CreatedModel } from '../../repositories/helper-types';
import { SubscribersRepository } from '../../repositories/subscriber/repository';
import { Subscriber } from '../../repositories/subscriber/schema';

@Injectable()
export class SubscriberService {

    constructor(private readonly subscriberRepository: SubscribersRepository) {}

    public createOrUpdate(subscriber: Subscriber) {
       return this.subscriberRepository.createOrUpdate(subscriber);
    }

    async create(subscriber: Subscriber) : Promise<CreatedModel> {
        return await this.subscriberRepository.create(subscriber);
    }

}
