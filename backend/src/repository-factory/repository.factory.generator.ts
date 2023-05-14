import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class RepositoryFactoryGenerator {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  generate<TDocument, TRepository, TRepositoryFactory>(
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
