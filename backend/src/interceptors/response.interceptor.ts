import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { IActionResult } from '../controllers/response-helpers/action-result.interface';
import { FastifyReply } from 'fastify';

export class ResponseInterceptor implements NestInterceptor<IActionResult,any> {
    intercept(context: ExecutionContext, next: CallHandler<IActionResult>): Observable<any> {
        const ctx = context.switchToHttp()
        const response = ctx.getResponse<FastifyReply>()

        return next.handle().pipe(
            map(ar => {
                response.code(ar.statusCode)
                return ar.body    
            })
        )
    }
}