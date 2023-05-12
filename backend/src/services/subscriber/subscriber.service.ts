import { Injectable } from '@nestjs/common';
import { CreatedModel } from '../../repositories/helper-types';
import { SubscribersRepository } from '../../repositories/subscriber/repository';
import { Subscriber } from '../../repositories/subscriber/schema';

@Injectable()
export class SubscriberService {

    constructor(private readonly subscriberRepository: SubscribersRepository) {}

    public createIfNotExists(subscriberId: string) {
       return this.subscriberRepository.findOrCreate({ id: subscriberId });
    }

    async create(subscriber: Subscriber) : Promise<CreatedModel> {
        return await this.subscriberRepository.create(subscriber);
    }
}
