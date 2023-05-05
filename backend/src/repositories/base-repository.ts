import mongoose, {
  AggregateOptions,
  FilterQuery,
  HydratedDocument,
  InsertManyOptions,
  MergeType,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  Require_id,
  SaveOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  MongooseBulkWriteOptions
} from 'mongoose';
import { Document } from 'mongoose';
import { AnyBulkWriteOperation, BulkWriteOptions } from 'mongodb'
import { CreatedModel, RemovedModel, UpdatedModel } from './helper-types';

export abstract class BaseRepository<T extends Document, TSchema> {
  constructor(protected readonly model: Model<T>) {}

  async create(doc: TSchema, saveOptions?: SaveOptions): Promise<CreatedModel> {
    const createdEntity = new this.model(doc);
    const savedResult = await createdEntity.save(saveOptions);

    return { id: savedResult.id, created: !!savedResult.id };
  }

  async findOrCreate(query: FilterQuery<T>): Promise<TSchema>{
    const result = (await this.model.findOne(query)) as TSchema;
    if (!result) {
      return (await this.model.create(query)) as TSchema;
    }
    return result;
  }

  async insertMany(docs: Array<TSchema>, options: InsertManyOptions): Promise<HydratedDocument<MergeType<MergeType<T, TSchema[]>, Require_id<T>>, {}, {}>[]> {
    return await this.model.insertMany(docs, options)
  }

  async find(filter: FilterQuery<T>, projection?: ProjectionType<T> ,options?: QueryOptions): Promise<Array<TSchema>> {
    return await this.model.find(filter, projection , options);
  }

  async findOne(filter: FilterQuery<T>, projection?: ProjectionType<T> , options?: QueryOptions): Promise<TSchema | null> {
    return await this.model.findOne(filter, projection, options);
  }

  async findById(id: string): Promise<TSchema | null> {
    return await this.model.findById(id);
  }

  async findAll(): Promise<Array<T>> {
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

  async aggregate(pipeline?: PipelineStage[], options?: AggregateOptions) : Promise<Array<TSchema>> {
    return this.model.aggregate(pipeline, options );
  }

  async bulkWrite(
      writeOperations: Array<AnyBulkWriteOperation<T extends Document ? object : (T extends {} ? T : object)>>,
      bulkWriteOptions?: BulkWriteOptions & MongooseBulkWriteOptions
  ) {
     return await this.model.bulkWrite(writeOperations)
  }
}
