import { Injectable } from '@nestjs/common';
import { SubscribersRepository } from '../../repositories/subscriber/repository';
import { Subscriber } from '../../repositories/subscriber/schema';

@Injectable()
export class SubscriberService {

    constructor(private readonly subscriberRepository: SubscribersRepository) {}

    public createOrUpdate(subscriber: Subscriber) {
       return this.subscriberRepository.createOrUpdate(subscriber);
    }

}
