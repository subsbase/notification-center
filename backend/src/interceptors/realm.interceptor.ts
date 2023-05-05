import { BadRequestException, CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Observable } from "rxjs";
import { GlobalContext } from "../types/global-context";

export class RealmInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<FastifyRequest>();
        const realm = request.headers['x-realm'] as string | undefined;

        if(!realm){
            throw new BadRequestException('x-realm header is required')
        }

        GlobalContext.Realm = realm!;    
        return next.handle();
    }

}