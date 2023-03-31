import * as request from 'supertest';
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ResponseInterceptor } from '../../../src/interceptors/response.interceptor';
import { MongoErrorFilter } from '../../../src/filters/mongo-error.filter';
import { ValidationErrorFilter } from '../../../src/filters/validation-error.filter';
import { ControllersModule } from '../../../src/controllers/controllers.module';
import { ConfigModule } from '@nestjs/config';
import mongoose from 'mongoose';

describe('subjects', () => {
    let app: INestApplication;
  
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({
            envFilePath: '.env.test'
        }), ControllersModule.withConfig(process.env.MONGODB_CONNECTION as string)],
      })
        .compile();
  
        app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
        await app.useGlobalInterceptors(new ResponseInterceptor())
        await app.useGlobalFilters(new MongoErrorFilter(), new ValidationErrorFilter());
        await app.init();
        await app.getHttpAdapter().getInstance().ready();
    });
  
    afterEach(async () => {
        await app.close();
        const mongodb = await mongoose.connect(process.env.MONGODB_CONNECTION as string)
        await mongodb.connection.db.dropDatabase();
    });
    
    it(`/POST subjects`, () => {
       return request(app.getHttpServer())
            .post('/subjects')
            .send({ name: 'Invoice' })
            .then(response => {
                expect(response.statusCode).toBe(HttpStatus.CREATED)
                expect(response.body.created).toBeTruthy()
            })
    });
});