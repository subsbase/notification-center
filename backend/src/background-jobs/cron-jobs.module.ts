import { DynamicModule, Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ArchiveNotificationsTask } from './archive-notifications';

@Module({})
export class BackgroundJobsModule {
  static withConfig(dbConnection: string): DynamicModule {
    return {
      module: BackgroundJobsModule,
      imports: [ScheduleModule.forRoot(), ServicesModule.withDbConnection(dbConnection)],
      providers: [ArchiveNotificationsTask],
    };
  }
}
