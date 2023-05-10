import { FastifyRequest } from 'fastify';
import { 
  QueryOptions,
  SaveOptions,
  InsertManyOptions,
  RemoveOptions,
  AggregateOptions,
  BulkWriteOptions,
  MongooseBulkWriteOptions } from 'mongoose'

declare module 'fastify' {
  export interface FastifyRequest {
    user?: {
        id: string,
        name: string,
        type: string,
        realm: string
    };
  }
}
export { FastifyRequest };

export type Payload = string | object 

declare module 'mongoose' {
 export interface QueryOptions{
   realm?: string;
 }
}

export { QueryOptions }

declare module 'mongoose' {
  export interface SaveOptions{
    realm?: string;
  }
 }
 
export { SaveOptions }


 declare module 'mongoose' {
  export interface InsertManyOptions{
    realm?: string;
  }
 }
 
 export { InsertManyOptions }

 declare module 'mongoose' {
  export interface RemoveOptions{
    realm?: string;
  }
 }
 
 export { RemoveOptions }


 declare module 'mongoose' {
  export interface AggregateOptions{
    realm?: string;
  }
 }
 
 export { AggregateOptions }


 declare module 'mongoose' {
  export interface BulkWriteOptions{
    realm?: string;
  }
 }
 
 export { BulkWriteOptions }


 declare module 'mongoose' {
  export interface MongooseBulkWriteOptions{
    realm?: string;
  }
 }
 
 export { MongooseBulkWriteOptions }

