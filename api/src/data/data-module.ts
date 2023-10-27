import { Global, Module } from "@nestjs/common";
import { jiraClientProvider } from "./jira-client";
import { DataSourcesRepository, DatasetsRepository } from "@entities/datasets";
import { LocalDatasetsRepository } from "./local/datasets-repository";
import { DomainsRepository } from "@entities/domains";
import { LocalDomainsRepository } from "./local/domains-repository";
import { HttpJiraDataSourcesRepository } from "./http/data-sources-repository";
import { JiraFieldsRepository } from "@usecases/datasets/sync/jira-fields-repository";
import { HttpJiraFieldsRepository } from "./http/fields-repository";
import { JiraStatusesRepository } from "@usecases/datasets/sync/jira-statuses-repository";
import { HttpJiraStatusesRepository } from "./http/statuses-repository";
import { IssuesRepository } from "@entities/issues";
import { LocalIssuesRepository } from "./local/issues-repository";
import { JiraIssuesRepository } from "@usecases/datasets/sync/jira-issues-repository";
import { HttpJiraIssuesRepository } from "./http/issues-repository";
import { StorageModule } from "./storage-module";

@Global()
@Module({
  imports: [StorageModule],
  providers: [
    jiraClientProvider,
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
