import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AggregateOptions, Model, PipelineStage } from 'mongoose';
import { BaseRepository } from '../base-repository';
import { Subscriber, SubscriberDocument } from './schema';

@Injectable()
export class SubscribersRepository extends BaseRepository<SubscriberDocument, Subscriber> {
    
    constructor(
    @InjectModel(Subscriber.name)
    protected readonly model: Model<SubscriberDocument>) {
        super(model);
    }

    createOrUpdate(subscriber: Subscriber):Promise<any>{
        let model = new this.model(subscriber);
        return model.save();
    }

    async aggregate(pipeline?: PipelineStage[], options?: AggregateOptions) : Promise<Subscriber[]> {
        return this.model.aggregate(pipeline, options );
    }
}
