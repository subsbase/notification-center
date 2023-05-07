import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscriber, SubscriberDocument } from './schema';
import { BaseRepository } from '../base-repository';

@Injectable()
export class SubscribersRepository extends BaseRepository<SubscriberDocument, Subscriber> {
    
    constructor(
    @InjectModel(Subscriber.name)
    protected readonly model: Model<SubscriberDocument>,
    protected readonly realm: string) {
        super(model, realm);
    }
}
