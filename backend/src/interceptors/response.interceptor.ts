import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { IActionResult } from '../controllers/response-helpers/action-result.interface';
import { FastifyReply } from 'fastify';
import { Reflector } from '@nestjs/core/services/reflector.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor<IActionResult,any> {

    constructor(
        @Inject(Reflector)
        private readonly reflector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler<IActionResult>): Observable<any> {
        
        const ignoreResponse = this.reflector.get<boolean>('ignoreResponse', context.getHandler());

        if(ignoreResponse){
            return next.handle();
        }
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