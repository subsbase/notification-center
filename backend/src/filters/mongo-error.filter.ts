import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoErrorFilter implements ExceptionFilter<MongoError> {
  catch(exception: MongoError, host: ArgumentsHost) {
    Logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const message = exception.message;

    response.code(HttpStatus.BAD_REQUEST).send({
      message,
    });
  }
}
