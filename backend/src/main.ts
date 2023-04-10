import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify/adapters';
import { AppModule } from './app.module';
import { MongoErrorFilter } from './filters/mongo-error.filter';
import { ValidationErrorFilter } from './filters/validation-error.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  
  app.enableCors({
   origin: (process.env.CORS_ORIGINS as string).split(',')
  })

  app.setGlobalPrefix('notifc')
  app.useGlobalFilters(new MongoErrorFilter(),new ValidationErrorFilter());

  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
