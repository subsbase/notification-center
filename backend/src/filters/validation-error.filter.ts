import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Error } from 'mongoose';

@Catch(Error.ValidationError)
export class ValidationErrorFilter implements ExceptionFilter<Error.ValidationError> {
  catch(exception: Error.ValidationError, host: ArgumentsHost) {

    Logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const message = exception.message;

    response
      .code(HttpStatus.BAD_REQUEST)
      .send({
        message
      });
  }
}