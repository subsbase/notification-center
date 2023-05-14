import { Model } from 'mongoose';

export class RepositoryFactory<TDocument, TRepository> {
  private readonly model: Model<TDocument>;
  private readonly repositoryType: { new (...args: any[]): TRepository };
  constructor(model: Model<TDocument>, repositoryType: { new (model: Model<TDocument>, realm: string): TRepository }) {
    this.model = model;
    this.repositoryType = repositoryType;
  }

  create(realm: string): TRepository {
    return new this.repositoryType(this.model, realm);
  }
}
