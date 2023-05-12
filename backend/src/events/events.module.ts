import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { InternalEventsModule } from '../internal-events/internal.events.module';

@Module({
  imports: [InternalEventsModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
