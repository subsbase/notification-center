import mongoose, {
  FilterQuery,
  Model,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { Document } from 'mongoose';
import { AnyBulkWriteOperation } from 'mongodb'
import { CreatedModel, RemovedModel, UpdatedModel } from './helper-types';

export abstract class BaseRepository<T extends Document, TSchema> {
  constructor(protected readonly model: Model<T>) {}

  async create(doc: object, saveOptions?: SaveOptions): Promise<CreatedModel> {
    const createdEntity = new this.model(doc);
    const savedResult = await createdEntity.save(saveOptions);

    return { id: savedResult.id, created: !!savedResult.id };
  }

  async find(filter: FilterQuery<T>, options?: QueryOptions): Promise<TSchema[]> {
    return await this.model.find(filter, null, options);
  }

  async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<TSchema | null> {
    return await this.model.findOne(filter, null, options);
  }

  async findById(id: string): Promise<TSchema | null> {
    return await this.model.findById(id);
  }

  async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async remove(filter: FilterQuery<T>): Promise<RemovedModel> {
    const { deletedCount } = await this.model.remove(filter);
    return { deletedCount, deleted: !!deletedCount };
  }

  async update(
    id: string,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions
    ): Promise<UpdatedModel> {
      return await this.updateOne( { _id: new mongoose.Types.ObjectId(id) }, updated, options)
    }

  async updateOne(
    filter: FilterQuery<T>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    return await this.model.updateOne(filter, updated, options); 
  }

  async updateMany(
    filter: FilterQuery<T>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    return await this.model.updateMany(filter, updated, options);
  }

  async bulkWrite(
      writeOperations: Array<AnyBulkWriteOperation<T extends Document ? any : (T extends {} ? T : any)>>
  ) {
     return await this.model.bulkWrite(writeOperations)
  }
}
