import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ControllersModule } from './controllers/controllers.module';
import { InterceptorsModule } from './interceptors/interceptors.module';
import { BackgroundJobsModule as BackgroundJobsModule } from './background-jobs/cron-jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    InterceptorsModule.withConfig(process.env.MONGODB_CONNECTION as string),
    ControllersModule.withConfig(process.env.MONGODB_CONNECTION as string),
    BackgroundJobsModule.withConfig(process.env.MONGODB_CONNECTION as string)
  ],
})
export class AppModule {}
