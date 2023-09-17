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
        console.info({ request, domainsRepo });
        const domains = await domainsRepo.getDomains();
        const domainId = request.params.domainId;
        const domain = domains.find((domain) => domain.id === domainId);
        console.info({ domains, domain });
        return createJiraClient(domain);
      },
    },
    DomainsRepository,
  ],
  exports: [JsonDB, Version3Client, DomainsRepository],
})
export class DataModule {}
