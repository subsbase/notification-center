import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { InvalidArgumentError } from '../types/exceptions';

@Catch(InvalidArgumentError)
export class InvalidArgumentErrorFilter implements ExceptionFilter<InvalidArgumentError> {
  catch(exception: InvalidArgumentError, host: ArgumentsHost) {

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