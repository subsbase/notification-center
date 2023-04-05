import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    Logger
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { FastifyRequest } from 'fastify';

  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.API_SECRET_KEY
          }
        );
       
      } catch(err)  {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: FastifyRequest): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  