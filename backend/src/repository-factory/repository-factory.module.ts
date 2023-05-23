import { Module } from '@nestjs/common';
import { RepositoryFactoryBuilder } from './repository-factory.builder';

@Module({
  providers: [RepositoryFactoryBuilder],
  exports: [RepositoryFactoryBuilder],
})
export class RepositoryFactoryModule {}
