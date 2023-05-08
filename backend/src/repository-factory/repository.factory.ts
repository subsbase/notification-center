import { REQUEST } from "@nestjs/core";
import { FastifyRequest } from "../types/global-types";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { BaseRepository } from "../repositories/base-repository";

@Injectable()
export class RepositoryFactory {

    constructor(
        @Inject(REQUEST) private readonly request: FastifyRequest,
        @InjectConnection() private readonly connection: Connection) {        
    }

    create<TRepository extends BaseRepository<any, any>>(typeRepository: { new(...args: any): TRepository }, modelName: string) : TRepository {

        const model = this.connection.model(modelName);
        const realm = this.Realm;
        return new typeRepository(model, realm)
    }

    private get Realm() : string {
        return this.request.headers['x-realm'] as string;
    }
}