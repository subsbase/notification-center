import { Module } from '@nestjs/common';
import { SchemaFactory } from './schema.factory';

@Module({ providers: [SchemaFactory], exports: [SchemaFactory] })
export class SchemaModule {}
