import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { IActionResult } from '../controllers/response-helpers/action-result.interface';
import { FastifyReply } from 'fastify';

export class ResponseInterceptor implements NestInterceptor<IActionResult> {
    intercept(context: ExecutionContext, next: CallHandler<IActionResult>): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();

        return next.handle().pipe(
            tap(ar => {
                response
                    .code(ar.statusCode)
                    .send(ar.body)
                    .then(() => {
                        response.sent = true;
                    },
                    (err) => {
                        Logger.error(err)
                    })
            })
        )
    }
}