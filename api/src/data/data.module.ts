import { Module } from '@nestjs/common';
import { cache } from './database';
import { JsonDB } from 'node-json-db';
import { Version3Client } from 'jira.js';
import { jiraClient } from './jira-client';

@Module({
  providers: [
    {
      provide: JsonDB,
      useValue: cache,
    },
    {
      provide: Version3Client,
      useValue: jiraClient,
    },
  ],
  exports: [JsonDB, Version3Client],
})
export class DataModule {}
