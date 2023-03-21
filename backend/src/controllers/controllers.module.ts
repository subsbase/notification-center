import { Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { SubjectController } from './subject/subjects.controller';

@Module({
  imports: [ServicesModule],
  controllers: [SubjectController],
})
export class ControllersModule {}
