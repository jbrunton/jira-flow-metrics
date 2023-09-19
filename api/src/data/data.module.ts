import { Module, Scope } from '@nestjs/common';
import { cache } from './database';
import { JsonDB } from 'node-json-db';
import { Version3Client } from 'jira.js';
import { createJiraClient } from './jira-client';
import { Request } from 'express';
import { DomainsRepository } from './domains.repository';
import { REQUEST } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: JsonDB,
      useValue: cache,
    },
    {
      scope: Scope.REQUEST,
      provide: Version3Client,
      inject: [REQUEST, DomainsRepository],
      useFactory: async (request: Request, domainsRepo: DomainsRepository) => {
        const domains = await domainsRepo.getDomains();
        const domainId = request.query.domainId;
        const domain = domains.find((domain) => domain.id === domainId);
        return createJiraClient(domain);
      },
    },
    DomainsRepository,
  ],
  exports: [JsonDB, Version3Client, DomainsRepository],
})
export class DataModule {}
