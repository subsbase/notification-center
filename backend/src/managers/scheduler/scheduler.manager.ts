import { Agenda, Job } from '@hokify/agenda';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulerManager {
  constructor(private readonly agenda: Agenda) {}

  defineJob<TDATA>(name: string, processor: (agendaJob: Job<TDATA>) => Promise<void>): void {
    this.agenda.define(name, processor);
    this.agenda.start();
  }
}
