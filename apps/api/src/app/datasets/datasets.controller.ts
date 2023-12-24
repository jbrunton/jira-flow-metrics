import { DatasetsRepository } from "@entities/datasets";
import { IssuesRepository } from "@entities/issues";
import { Controller, Delete, Get, Param, Put, Query } from "@nestjs/common";
import { SyncUseCase } from "@usecases/datasets/sync/sync-use-case";
import { CycleTimesUseCase } from "@usecases/issues/metrics/cycle-times-use-case";

@Controller("datasets")
export class DatasetsController {
  constructor(
    private readonly datasets: DatasetsRepository,
    private readonly issues: IssuesRepository,
    private readonly sync: SyncUseCase,
    private readonly cycleTimes: CycleTimesUseCase,
  ) {}

  @Get(":datasetId")
  async getDataset(@Param("datasetId") datasetId: string) {
    return this.datasets.getDataset(datasetId);
  }

  @Delete(":datasetId")
  async removeDataset(@Param("datasetId") datasetId: string) {
    return this.datasets.removeDataset(datasetId);
  }

  @Put(":datasetId/sync")
  async syncDataset(@Param("datasetId") datasetId: string) {
    return this.sync.exec(datasetId);
  }

  @Get(":datasetId/issues")
  async getIssues(
    @Param("datasetId") datasetId: string,
    @Query("includeWaitTime") includeWaitTime: string,
    @Query("fromStatus") fromStatus?: string,
    @Query("toStatus") toStatus?: string,
  ) {
    let issues = await this.issues.getIssues(datasetId);
    const dataset = await this.datasets.getDataset(datasetId);

    const orderedStatuses = dataset.statuses.map((status) => status.name);

    issues = this.cycleTimes.exec(
      issues,
      ["true", "1"].includes(includeWaitTime),
      orderedStatuses,
      fromStatus,
      toStatus,
    );

    return issues.map((issue) => {
      const parent = issue.parentKey
        ? issues.find((parent) => parent.key === issue.parentKey)
        : undefined;
      return { ...issue, parent };
    });
  }

  @Get(":datasetId/statuses")
  async getStatuses(@Param("datasetId") datasetId: string) {
    const dataset = await this.datasets.getDataset(datasetId);
    const storyStatuses = dataset.statuses.map((status) => status.name);
    // TODO: epic cycle time policies
    const epicStatuses = [];
    return {
      Story: storyStatuses,
      Epic: epicStatuses,
    };
  }
}
