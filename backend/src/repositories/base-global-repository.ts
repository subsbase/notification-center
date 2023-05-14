import {
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
  MongooseBulkWriteOptions,
  RemoveOptions,
} from 'mongoose';
import { Document } from 'mongoose';
import { AnyBulkWriteOperation, BulkWriteOptions, BulkWriteResult } from 'mongoose/node_modules/mongodb';
import { CreatedModel, RemovedModel, UpdatedModel } from './helper-types';

export abstract class GlobalRepository<T extends Document, TSchema> {
  constructor(protected readonly model: Model<T>) {}

  async create(doc: TSchema, saveOptions?: SaveOptions): Promise<CreatedModel> {
    const createdEntity = new this.model(doc);
    const savedResult = await createdEntity.save(saveOptions);

    return { id: savedResult.id, created: !!savedResult.id };
  }

  async save(doc: TSchema): Promise<TSchema>;
  async save(doc: TSchema, saveOptions?: SaveOptions): Promise<TSchema>;
  async save(doc: TSchema, saveOptions?: SaveOptions): Promise<TSchema> {
    const createdEntity = new this.model(doc);
    const savedResult = await createdEntity.save(saveOptions);

    return savedResult as TSchema;
  }

  async findOrCreate(
    query: FilterQuery<T>,
    projection?: ProjectionType<T>,
    queryOptions?: QueryOptions<T>,
    saveOptions?: SaveOptions,
  ): Promise<TSchema> {
    const result = (await this.model.findOne(query, projection, queryOptions)) as TSchema;
    if (!result) {
      return (await this.save(query as TSchema, saveOptions)) as TSchema;
    }
    return result;
  }

  async insertMany(
    docs: Array<TSchema>,
    options: InsertManyOptions,
  ): Promise<HydratedDocument<MergeType<MergeType<T, TSchema[]>, Require_id<T>>, {}, {}>[]> {
    return await this.model.insertMany(docs, options);
  }

  async find(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions): Promise<Array<TSchema>> {
    return await this.model.find(filter, projection, options);
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<TSchema | null> {
    return await this.model.findOne(filter, projection, options);
  }

  async findById(id: string, projection?: ProjectionType<T>, options?: QueryOptions): Promise<TSchema | null> {
    return await this.model.findById(id, projection, options);
  }

  async remove(filter: FilterQuery<T>, options?: RemoveOptions): Promise<RemovedModel> {
    const { deletedCount } = await this.model.remove(filter, options);
    return { deletedCount, deleted: !!deletedCount };
  }

  async update(
    id: string,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    return await this.updateOne({ _id: id }, updated, options);
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

  async aggregate(pipeline?: PipelineStage[], options?: AggregateOptions): Promise<Array<TSchema>> {
    return this.model.aggregate(pipeline, options);
  }

  async bulkWrite(
    writeOperations: Array<AnyBulkWriteOperation<T extends Document ? object : T extends {} ? T : object>>,
    bulkWriteOptions?: BulkWriteOptions & MongooseBulkWriteOptions,
  ): Promise<BulkWriteResult> {
    return await this.model.bulkWrite(writeOperations, bulkWriteOptions);
  }

  //only used with chileds so we can build operations dynamicly
  protected async bulkWriteAny(writeOperations: any, bulkWriteOptions?: BulkWriteOptions & MongooseBulkWriteOptions) {
    return await this.model.bulkWrite(writeOperations, bulkWriteOptions);
  }
}
