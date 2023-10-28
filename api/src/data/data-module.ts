import { Global, Module, Scope } from "@nestjs/common";
import { jiraClientFactory } from "./http/client/jira-client";
import { DataSourcesRepository, DatasetsRepository } from "@entities/datasets";
import { LocalDatasetsRepository } from "./local/datasets-repository";
import { DomainsRepository } from "@entities/domains";
import { LocalDomainsRepository } from "./local/domains-repository";
import { HttpJiraDataSourcesRepository } from "./http/repositories/data-sources-repository";
import { IssuesRepository } from "@entities/issues";
import { LocalIssuesRepository } from "./local/issues-repository";
import { JiraIssuesRepository } from "@usecases/datasets/sync/jira-issues-repository";
import { HttpJiraIssuesRepository } from "./http/repositories/jira-issues-repository";
import { StorageModule } from "./storage/storage-module";
import { Version3Client } from "jira.js";
import { REQUEST } from "@nestjs/core";

@Global()
@Module({
  imports: [StorageModule],
  providers: [
    {
      scope: Scope.REQUEST,
      provide: Version3Client,
      inject: [REQUEST, DomainsRepository],
      useFactory: jiraClientFactory,
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
      provide: JiraIssuesRepository,
      useClass: HttpJiraIssuesRepository,
    },
  ],
  exports: [
    DomainsRepository,
    DatasetsRepository,
    DataSourcesRepository,
    IssuesRepository,
    JiraIssuesRepository,
  ],
})
export class DataModule {}
