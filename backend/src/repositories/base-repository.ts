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
    MongooseBulkWriteOptions,
    RemoveOptions
  } from 'mongoose';
  import { Document } from 'mongoose';
  import { AnyBulkWriteOperation, BulkWriteOptions } from 'mongodb'
  import { CreatedModel, RemovedModel, UpdatedModel } from './helper-types';
  
  export abstract class BaseRepository<T extends Document, TSchema> {
  
    constructor(
        protected readonly model: Model<T>,
        protected readonly realm: string) { }
  
    async create(doc: TSchema, saveOptions?: SaveOptions): Promise<CreatedModel> {
      const createdEntity = new this.model(doc);
      const savedResult = await createdEntity.save({...saveOptions, realm: this.realm});
  
      return { id: savedResult.id, created: !!savedResult.id };
    }
  
    async findOrCreate(query: FilterQuery<T>, projection?: ProjectionType<T>, queryOptions?: QueryOptions<T>, saveOptions?: SaveOptions): Promise<TSchema>{
      const result = (await this.model.findOne(query, projection, { ...queryOptions, realm: this.realm })) as TSchema;
      if (!result) {
        return (await this.model.create({ ...query, realm: this.realm }, {...saveOptions, realm: this.realm})) as TSchema;
      }
      return result;
    }
  
    async insertMany(docs: Array<TSchema>, options: InsertManyOptions): Promise<HydratedDocument<MergeType<MergeType<T, TSchema[]>, Require_id<T>>, {}, {}>[]> {
      return await this.model.insertMany(docs, {...options, realm: this.realm})
    }
  
    async find(filter: FilterQuery<T>, projection?: ProjectionType<T> ,options?: QueryOptions): Promise<Array<TSchema>> {
      return await this.model.find(filter, projection , {...options, realm: this.realm});
    }
  
    async findOne(filter: FilterQuery<T>, projection?: ProjectionType<T> , options?: QueryOptions): Promise<TSchema | null> {
      return await this.model.findOne(filter, projection, {...options, realm: this.realm});
    }
  
    async findById(id: string,projection?: ProjectionType<T>, options?: QueryOptions): Promise<TSchema | null> {
      return await this.model.findById(id, projection, {...options, realm: this.realm});
    }

    async remove(filter: FilterQuery<T>, options?: RemoveOptions): Promise<RemovedModel> {
      const { deletedCount } = await this.model.remove(filter, {...options, realm: this.realm});
      return { deletedCount, deleted: !!deletedCount };
    }
  
    async update(
      id: string,
      updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
      options?: QueryOptions
      ): Promise<UpdatedModel> {
        return await this.updateOne( { _id: new mongoose.Types.ObjectId(id) }, updated, {...options, realm: this.realm})
      }
  
    async updateOne(
      filter: FilterQuery<T>,
      updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
      options?: QueryOptions,
    ): Promise<UpdatedModel> {
      return await this.model.updateOne(filter, updated, {...options, realm: this.realm}); 
    }
  
    async updateMany(
      filter: FilterQuery<T>,
      updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
      options?: QueryOptions,
    ): Promise<UpdatedModel> {
      return await this.model.updateMany(filter, updated, {...options, realm: this.realm});
    }
  
    async aggregate(pipeline?: PipelineStage[], options?: AggregateOptions) : Promise<Array<TSchema>> {
      return this.model.aggregate(pipeline, {...options, realm: this.realm} );
    }
  
    async bulkWrite(
        writeOperations: Array<AnyBulkWriteOperation<T extends Document ? object : (T extends {} ? T : object)>>,
        bulkWriteOptions?: BulkWriteOptions & MongooseBulkWriteOptions
    ) {
       return await this.model.bulkWrite(writeOperations, {...bulkWriteOptions, realm: this.realm})
    }
  }
  