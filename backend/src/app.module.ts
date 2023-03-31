import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ControllersModule } from './controllers/controllers.module';

@Module({
  imports: [ConfigModule.forRoot(), ControllersModule.withConfig(process.env.MONGODB_CONNECTION as string)],
})
export class AppModule {}
