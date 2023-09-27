import { Global, Module, Scope } from '@nestjs/common';
import { DomainsCache, LocalCache } from './database';
import { Version3Client } from 'jira.js';
import { createJiraClient } from './jira-client';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { DataSourcesRepository, DatasetsRepository } from '@entities/datasets';
import { LocalDatasetsRepository } from './local/datasets-repository';
import { DomainsRepository } from '@entities/domains';
import { LocalDomainsRepository } from './local/domains-repository';
import { HttpJiraDataSourcesRepository } from './http/data-sources-repository';
import { JiraFieldsRepository } from '@usecases/issues/sync/jira-fields-repository';
import { HttpJiraFieldsRepository } from './http/fields-repository';
import { JiraStatusesRepository } from '@usecases/issues/sync/jira-statuses-repository';
import { HttpJiraStatusesRepository } from './http/statuses-repository';
import { IssuesRepository } from '@entities/issues';
import { LocalIssuesRepository } from './local/issues-repository';
import { JiraIssuesRepository } from '@usecases/issues/sync/jira-issues-repository';
import { HttpJiraIssuesRepository } from './http/issues-repository';

@Global()
@Module({
  providers: [
    DomainsCache,
    LocalCache,
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
    {
      provide: DomainsRepository,
      useClass: LocalDomainsRepository,
    },
    {
      provide: DatasetsRepository,
      useClass: LocalDatasetsRepository,
    },
    {
      provide: IssuesRepository,
      useClass: LocalIssuesRepository,
    },
    {
      provide: DataSourcesRepository,
      useClass: HttpJiraDataSourcesRepository,
    },
    {
      provide: JiraFieldsRepository,
      useClass: HttpJiraFieldsRepository,
    },
    {
      provide: JiraStatusesRepository,
      useClass: HttpJiraStatusesRepository,
    },
    {
      provide: JiraFieldsRepository,
      useClass: HttpJiraFieldsRepository,
    },
    {
      provide: JiraIssuesRepository,
      useClass: HttpJiraIssuesRepository,
    },
  ],
  exports: [
    DomainsRepository,
    DatasetsRepository,
    DataSourcesRepository,
    IssuesRepository,
    JiraFieldsRepository,
    JiraStatusesRepository,
    JiraIssuesRepository,
  ],
})
export class DataModule {}
