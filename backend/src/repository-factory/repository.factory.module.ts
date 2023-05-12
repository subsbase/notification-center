import { Module } from '@nestjs/common';
import { RepositoryFactory } from './repository.factory';

@Module({
  providers: [RepositoryFactory],
  exports: [RepositoryFactory],
})
export class RepositoryFactoryModule {}
