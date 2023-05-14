import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscriber, SubscriberDocument } from './schema';
import { BaseRepository } from '../base-repository';
import { RepositoryFactory } from '../repository.factory';

@Injectable()
export class SubscribersRepository extends BaseRepository<SubscriberDocument, Subscriber> {
  constructor(
    @InjectModel(Subscriber.name)
    protected readonly model: Model<SubscriberDocument>,
    protected readonly realm: string,
  ) {
    super(model, realm);
  }
}

@Injectable()
export class SubscribersRepositoryFactory extends RepositoryFactory<SubscriberDocument, SubscribersRepository> {
  constructor(
    model: Model<SubscriberDocument>,
    repositoryType: { new (model: Model<SubscriberDocument>, realm: string): SubscribersRepository },
  ) {
    super(model, repositoryType);
  }
}
