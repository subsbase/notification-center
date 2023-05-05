import { CallHandler, ExecutionContext, Inject, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { FastifyRequest } from '../types/global-types';
import { IncomingHttpHeaders } from "http";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";

export class AuthorizationInterceptor implements NestInterceptor {

    constructor(
        @Inject(Reflector)
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        
        const requireAuthorization = this.reflector.get<boolean>('authRequired', context.getHandler());
        
        if(requireAuthorization){
            await this.verifyRequestAuthorization(context);
        }

        return next.handle()
    }

    private async verifyRequestAuthorization(context: ExecutionContext){
        try {
            const ctx = context.switchToHttp()
            const request = ctx.getRequest<FastifyRequest>()
            const headers = request.headers;

            const [_,token] = this.extractAuthorizationHeader(headers)
            const user = await this.jwtService.verifyAsync(token)
            if(user.realm !== headers['realm'])
            {
                throw new UnauthorizedException('realm not match');
            }
            request.user = user;
            
        }catch(err) {
            throw new UnauthorizedException()
        }
    }

    private extractAuthorizationHeader(headers: IncomingHttpHeaders): string[] {

        return headers.authorization?.split(' ') ?? []
    }

}