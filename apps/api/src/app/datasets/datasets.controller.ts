import { DatasetsRepository } from "@entities/datasets";
import { IssuesRepository } from "@entities/issues";
import { getFlowMetrics } from "@jbrunton/flow-metrics";
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Put,
  Query,
} from "@nestjs/common";
import { SyncUseCase } from "@usecases/datasets/sync/sync-use-case";

@Controller("datasets")
export class DatasetsController {
  constructor(
    private readonly datasets: DatasetsRepository,
    private readonly issues: IssuesRepository,
    private readonly sync: SyncUseCase,
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
    @Query(
      "statuses",
      new ParseArrayPipe({ items: String, separator: ",", optional: true }),
    )
    statuses?: string[],
  ) {
    let issues = await this.issues.getIssues(datasetId);

    issues = getFlowMetrics(
      issues,
      ["true", "1"].includes(includeWaitTime),
      statuses,
    );

    return issues.map((issue) => {
      const parent = issue.parentKey
        ? issues.find((parent) => parent.key === issue.parentKey)
        : undefined;
      return { ...issue, parent };
    });
  }

  @Get(":datasetId/workflows")
  async getWorkflows(@Param("datasetId") datasetId: string) {
    const dataset = await this.datasets.getDataset(datasetId);
    // TODO: epic cycle time policies
    return {
      Story: dataset.workflow,
      Epic: [],
    };
  }
}
