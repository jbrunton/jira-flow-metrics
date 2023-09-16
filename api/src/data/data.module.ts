import { Module } from '@nestjs/common';
import { cache } from './database';
import { JsonDB } from 'node-json-db';

@Module({
  providers: [
    {
      provide: JsonDB,
      useValue: cache,
    },
  ],
  exports: [JsonDB],
})
export class DataModule {}
