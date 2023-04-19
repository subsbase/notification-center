import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  export interface FastifyRequest {
    user?: {
        id: string,
        name: string,
        type: string
    };
  }
}
export { FastifyRequest };

export type Payload = string | object 
