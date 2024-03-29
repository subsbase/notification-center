import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify/adapters';
import { AppModule } from './app.module';
import { MongoErrorFilter } from './filters/mongo-error.filter';
import { ValidationErrorFilter } from './filters/validation-error.filter';
import { InvalidArgumentErrorFilter } from './filters/invalid-argument-error.filter';
import { NotificationCenterSocketAdapter } from './events/notification.center.socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        timestamp: () => `, "timestamp": "${new Date().toISOString()}"`,
      },
    }),
  );

  app
    .setGlobalPrefix('notifc', {
      exclude: [
        {
          path: '/healthz',
          method: RequestMethod.GET,
        },
      ],
    })
    .useWebSocketAdapter(new NotificationCenterSocketAdapter(app))
    .useGlobalPipes(new ValidationPipe())
    .useGlobalFilters(new MongoErrorFilter(), new ValidationErrorFilter(), new InvalidArgumentErrorFilter())
    .enableCors({
      origin: (process.env.ALLOWED_ORIGINS as string).split(','),
    });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
