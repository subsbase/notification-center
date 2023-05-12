import { BadRequestException, CallHandler, ExecutionContext, Inject, NestInterceptor } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

export class RealmInterceptor implements NestInterceptor {
  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const ignoreRealm = this.reflector.get<boolean>('ignoreRealm', context.getHandler());

    if (!ignoreRealm) {
      this.SetGlobalContexRealm(context);
    }
    return next.handle();
  }

  private SetGlobalContexRealm(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const realm = request.headers['x-realm'] as string | undefined;

    if (!realm) {
      throw new BadRequestException('x-realm header is required');
    }
  }
}
