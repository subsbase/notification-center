import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiSecretInterceptor } from './api.secret.interceptor';
import { AuthorizationInterceptor } from './authorization.interceptor';
import { ResponseInterceptor } from './response.interceptor';
import { ServicesModule } from '../services/services.module';
import { RealmInterceptor } from './realm.interceptor';


@Module({})
export class InterceptorsModule {
  static withConfig(dbConnection: string) : DynamicModule {
    return {
      module: InterceptorsModule,
      imports: [ServicesModule.withDbonnection(dbConnection)],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: ApiSecretInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: RealmInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AuthorizationInterceptor
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ResponseInterceptor,
        }
      ]
    }
  }
}
