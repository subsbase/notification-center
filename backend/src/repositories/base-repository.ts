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
import {
  InsertOneModel,
  AnyBulkWriteOperation,
  BulkWriteOptions,
  BulkWriteResult,
} from 'mongoose/node_modules/mongodb';
import { CreatedModel, RemovedModel, UpdatedModel } from './helper-types';
import { GlobalRepository } from './base-global-repository';

export abstract class BaseRepository<T extends Document, TSchema> extends GlobalRepository<T, TSchema> {
  constructor(protected readonly model: Model<T>, protected readonly realm: string) {
    super(model);
  }

  async create(doc: TSchema, saveOptions?: SaveOptions): Promise<CreatedModel> {
    return super.create({ ...doc, realm: this.realm }, { ...saveOptions, realm: this.realm });
  }

  async save(doc: TSchema): Promise<TSchema>;
  async save(doc: TSchema, saveOptions?: SaveOptions): Promise<TSchema>;
  async save(doc: TSchema, saveOptions?: SaveOptions): Promise<TSchema> {
    return super.save({ ...doc, realm: this.realm }, { ...saveOptions, realm: this.realm });
  }

  async findOrCreate(
    query: FilterQuery<T>,
    projection?: ProjectionType<T>,
    queryOptions?: QueryOptions<T>,
    saveOptions?: SaveOptions,
  ): Promise<TSchema> {
    return super.findOrCreate(
      { ...query, realm: this.realm },
      projection,
      { ...queryOptions, realm: this.realm },
      { ...saveOptions, realm: this.realm },
    );
  }

  async findOrCreateById(
    id: string,
    query: FilterQuery<T>,
    projection?: ProjectionType<T>,
    queryOptions?: QueryOptions<T>,
    saveOptions?: SaveOptions,
  ): Promise<TSchema> {
    return super.findOrCreateById(
      id,
      { ...query, realm: this.realm },
      projection,
      { ...queryOptions, realm: this.realm },
      { ...saveOptions, realm: this.realm },
    );
  }

  async insertMany(
    docs: Array<TSchema>,
    options: InsertManyOptions,
  ): Promise<HydratedDocument<MergeType<MergeType<T, TSchema[]>, Require_id<T>>, {}, {}>[]> {
    return super.insertMany(
      docs.map((doc) => ({ ...doc, realm: this.realm })),
      { ...options, realm: this.realm },
    );
  }

  async find(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions): Promise<Array<TSchema>> {
    return super.find(filter, projection, { ...options, realm: this.realm });
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<TSchema | null> {
    return super.findOne(filter, projection, { ...options, realm: this.realm });
  }

  async findById(id: string, projection?: ProjectionType<T>, options?: QueryOptions): Promise<TSchema | null> {
    return super.findById(id, projection, { ...options, realm: this.realm });
  }

  async remove(filter: FilterQuery<T>, options?: RemoveOptions): Promise<RemovedModel> {
    return super.remove(filter, { ...options, realm: this.realm });
  }

  async update(
    id: string,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    return super.update(id, updated, { ...options, realm: this.realm });
  }

  async updateOne(
    filter: FilterQuery<T>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    return super.updateOne(filter, updated, { ...options, realm: this.realm });
  }

  async updateMany(
    filter: FilterQuery<T>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    return super.updateMany(filter, updated, { ...options, realm: this.realm });
  }

  async aggregate(pipeline?: PipelineStage[], options?: AggregateOptions): Promise<Array<TSchema>> {
    return super.aggregate(pipeline, { ...options, realm: this.realm });
  }

  async bulkWrite(
    writeOperations: Array<AnyBulkWriteOperation<T extends Document ? object : T extends {} ? T : object>>,
    bulkWriteOptions?: BulkWriteOptions & MongooseBulkWriteOptions,
  ): Promise<BulkWriteResult> {
    const mappedOperations = writeOperations.map((writeOperation) => {
      const operation = writeOperation as any;
      if (operation.insertOne !== undefined) {
        return {
          insertOne: {
            document: {
              ...operation.insertOne.document,
              realm: this.realm,
            },
          },
        };
      }

      const [operationName, value] = Object.entries(writeOperation)[0];

      return Object.defineProperty({}, operationName, {
        value: {
          ...value,
          filter: {
            ...value.filter,
            realm: this.realm,
          },
        },
      });
    });
    return super.bulkWriteAny(mappedOperations, { ...bulkWriteOptions, realm: this.realm });
  }
}
