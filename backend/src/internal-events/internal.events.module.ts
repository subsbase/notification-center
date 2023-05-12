import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      ignoreErrors: true,
      delimiter: '.',
      wildcard: true,
      global: true,
      newListener: true,
    }),
  ],
})
export class InternalEventsModule {}
