import { Global, Module } from "@nestjs/common";
import { DataSourcesRepository, DatasetsRepository } from "@entities/datasets";
import { LocalDatasetsRepository } from "./local/repositories/datasets-repository";
import { DomainsRepository } from "@entities/domains";
import { LocalDomainsRepository } from "./local/repositories/domains-repository";
import { HttpJiraDataSourcesRepository } from "./http/repositories/data-sources-repository";
import { IssuesRepository } from "@entities/issues";
import { LocalIssuesRepository } from "./local/issues-repository";
import { JiraIssuesRepository } from "@usecases/datasets/sync/jira-issues-repository";
import { HttpJiraIssuesRepository } from "./http/repositories/jira-issues-repository";
import { StorageModule } from "./storage/storage-module";

@Global()
@Module({
  imports: [StorageModule],
  providers: [
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
