import { DataSourcesRepository, DatasetsRepository } from "@entities/datasets";
import { IssuesRepository } from "@entities/issues";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { SyncUseCase } from "@usecases/datasets/sync/sync-use-case";
import { CycleTimesUseCase } from "@usecases/issues/metrics/cycle-times-use-case";

class CreateDatasetBody {
  @ApiProperty()
  name: string;

  @ApiProperty()
  jql: string;
}

@Controller("datasets")
export class DatasetsController {
  constructor(
    private readonly datasets: DatasetsRepository,
    private readonly dataSources: DataSourcesRepository,
    private readonly issues: IssuesRepository,
    private readonly sync: SyncUseCase,
    private readonly cycleTimes: CycleTimesUseCase,
  ) {}

  @Get()
  async getDatasets(@Query("domainId") domainId: string) {
    return this.datasets.getDatasets(domainId);
  }

  @Get("sources")
  async getDataSources(@Query("query") query: string) {
    return this.dataSources.getDataSources(query);
  }

  @Post()
  async createDataset(
    @Query("domainId") domainId,
    @Body() dataset: CreateDatasetBody,
  ) {
    return await this.datasets.addDataset(domainId, dataset);
  }

  @Delete(":datasetId")
  async removeDataset(
    @Query("domainId") domainId,
    @Param("datasetId") datasetId: string,
  ) {
    return this.datasets.removeDataset(domainId, datasetId);
  }

  @Put(":dataset/sync")
  async syncDataset(
    @Query("domainId") domainId: string,
    @Param("dataset") datasetId: string,
  ) {
    return this.sync.exec(domainId, datasetId);
  }

  @Get(":datasetId/issues")
  async getIssues(
    @Param("datasetId") datasetId: string,
    @Query("domainId") domainId: string,
    @Query("fromStatus") fromStatus?: string,
    @Query("toStatus") toStatus?: string,
  ) {
    let issues = await this.issues.getIssues(domainId, datasetId);

    if (fromStatus && toStatus) {
      issues = this.cycleTimes.exec(issues, fromStatus, toStatus);
    }

    return issues.map((issue) => {
      const parent = issue.parentKey
        ? issues.find((parent) => parent.key === issue.parentKey)
        : undefined;
      return { ...issue, parent };
    });
  }
}
