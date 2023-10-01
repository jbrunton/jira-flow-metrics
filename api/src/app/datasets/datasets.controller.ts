import { DataSourcesRepository, DatasetsRepository } from "@entities/datasets";
import { DomainsRepository } from "@entities/domains";
import { IssuesRepository } from "@entities/issues";
import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { SyncUseCase } from "@usecases/datasets/sync/sync-use-case";

class CreateDataSetBody {
  @ApiProperty()
  name: string;

  @ApiProperty()
  jql: string;
}

@Controller("datasets")
export class DataSetsController {
  constructor(
    private readonly datasets: DatasetsRepository,
    private readonly dataSources: DataSourcesRepository,
    private readonly issues: IssuesRepository,
    private readonly domains: DomainsRepository,
    private readonly sync: SyncUseCase,
  ) {}

  @Get()
  async getDataSets(@Query("domainId") domainId: string) {
    return this.datasets.getDatasets(domainId);
  }

  @Get("sources")
  async getDataSources(@Query("query") query: string) {
    return this.dataSources.getDataSources(query);
  }

  @Post()
  async createDataSet(
    @Query("domainId") domainId,
    @Body() dataset: CreateDataSetBody,
  ) {
    return await this.datasets.addDataset(domainId, dataset);
  }

  @Put(":dataset/sync")
  async syncDataset(
    @Query("domainId") domainId: string,
    @Param("dataset") datasetId: string,
  ) {
    return this.sync.exec(domainId, datasetId);
  }

  @Get(":dataset/issues")
  async getIssues(
    @Query("domainId") domainId: string,
    @Param("dataset") datasetId: string,
  ) {
    return this.issues.getIssues(domainId, datasetId);
  }
}
