import { Injectable } from '@nestjs/common';
import { CreatedModel } from '../../repositories/helper-types';
import { SubscribersRepositoryFactory } from '../../repositories/subscriber/repository';
import { Subscriber } from '../../repositories/subscriber/schema';

@Injectable()
export class SubscriberService {
  constructor(private readonly subscriberRepositoryFactory: SubscribersRepositoryFactory) {}

  public createIfNotExists(realm: string, subscriberId: string) {
    return this.subscriberRepositoryFactory.create(realm).findOrCreate({ _id: subscriberId });
  }

  async create(realm: string, subscriber: Subscriber): Promise<CreatedModel> {
    return await this.subscriberRepositoryFactory.create(realm).create(subscriber);
  }
}
