import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../repositories/repositories.module';
import { SubjectService } from './subject/subject.service';

@Module({
  imports: [RepositoriesModule],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class ServicesModule {}
