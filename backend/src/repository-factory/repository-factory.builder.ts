import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { BaseRepository } from 'src/repositories/base-repository';
import { Document } from 'mongoose'
import { RepositoryFactory } from 'src/repositories/repository.factory';

@Injectable()
export class RepositoryFactoryBuilder {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  build<TDocument extends Document, TSchema, TRepository extends BaseRepository<TDocument, TSchema>, TRepositoryFactory extends RepositoryFactory<TDocument, TRepository>>(
    modelName: string,
    repositortyType: { new (model: Model<TDocument>, realm: string): TRepository },
    repositoryFactoryType: {
      new (
        model: Model<TDocument>,
        repositoryType: { new (model: Model<TDocument>, realm: string): TRepository },
      ): TRepositoryFactory;
    },
  ): TRepositoryFactory {
    const model = this.connection.model(modelName);
    return new repositoryFactoryType(model, repositortyType);
  }
}
