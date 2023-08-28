import { DynamicModule, Module } from '@nestjs/common';
import { ManagersModule } from 'src/managers/managers.module';
import { AgendaScheduler } from './agenda.scheduler';

@Module({})
export class SchedulerModule {
  static forRoot(dbConnection: string): DynamicModule {
    return {
      module: SchedulerModule,
      imports: [ManagersModule.withConfig(dbConnection)],
      providers: [AgendaScheduler],
    };
  }
}
