import { HttpStatus } from "@nestjs/common";
import { FastifyReply } from 'fastify';

export abstract class BaseController {

    internalServerError(response:  FastifyReply): void {
       response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }

    badRequest(response: FastifyReply, body?: object): void {
        response.status(HttpStatus.BAD_REQUEST).send(body)
    }

    badRequestMessage(response: FastifyReply, message?: string): void {
        response.status(HttpStatus.BAD_REQUEST).send({ message })
    }

    notFound(response: FastifyReply){
        response.status(HttpStatus.NOT_FOUND).send()
    }

    ok(response: FastifyReply, body?: object) : void {
        response.status(HttpStatus.OK).send(body)
    }

    created(response: FastifyReply, body?: object): void {
        response.status(HttpStatus.CREATED).send(body)
    }
}