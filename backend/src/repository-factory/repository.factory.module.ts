import { Module } from '@nestjs/common';
import { RepositoryFactoryGenerator } from './repository.factory.generator';

@Module({
  providers: [RepositoryFactoryGenerator],
  exports: [RepositoryFactoryGenerator],
})
export class RepositoryFactoryModule {}
