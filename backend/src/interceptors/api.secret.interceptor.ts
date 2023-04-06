import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common"
import { FastifyRequest } from '../types/global-types';
import { IncomingHttpHeaders } from "http";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth/auth.service";


@Injectable()
export class ApiSecretInterceptor implements NestInterceptor {

    constructor(private readonly authService: AuthService) { }
    
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const ctx = context.switchToHttp()
        const request = ctx.getRequest<FastifyRequest>()
        const headers = request.headers;

        const authorizationHeader = this.extractAuthorizationHeader(headers);
        
        if(authorizationHeader && /ApiSecret/i.test(authorizationHeader)){
            await this.authenticateAndSetAuthHeaders(authorizationHeader, headers)
        }

        return next.handle();
    }

    private async authenticateAndSetAuthHeaders(authorizationHeader: string, headers: IncomingHttpHeaders) {
        const apiSecret = authorizationHeader.split(' ')[1];
        const access_token = await this.authService.authenticateWithApiSecret(apiSecret);
        headers.authorization = `Bearer ${access_token}`
    }

    private extractAuthorizationHeader(headers: IncomingHttpHeaders): string | undefined {
        return headers.authorization
    }
}