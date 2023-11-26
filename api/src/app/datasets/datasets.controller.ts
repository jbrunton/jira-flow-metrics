import { DatasetsRepository } from "@entities/datasets";
import { HierarchyLevel, Issue, IssuesRepository } from "@entities/issues";
import { Controller, Delete, Get, Param, Put, Query } from "@nestjs/common";
import { SyncUseCase } from "@usecases/datasets/sync/sync-use-case";
import { CycleTimesUseCase } from "@usecases/issues/metrics/cycle-times-use-case";
import { flatten, isNil, reject, uniq } from "rambda";

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

    issues = this.cycleTimes.exec(
      issues,
      ["true", "1"].includes(includeWaitTime),
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
    const issues = await this.issues.getIssues(datasetId);
    const getStatuses = (issues: Issue[]) =>
      reject(isNil)(
        uniq(
          flatten(
            issues.flatMap((issue) =>
              issue.transitions.map((t) => [
                t.fromStatus.name,
                t.toStatus.name,
              ]),
            ),
          ),
        ),
      );
    const storyStatuses = getStatuses(
      issues.filter((issue) => issue.hierarchyLevel === HierarchyLevel.Story),
    );
    const epicStatuses = getStatuses(
      issues.filter((issue) => issue.hierarchyLevel === HierarchyLevel.Epic),
    );
    return {
      Story: storyStatuses,
      Epic: epicStatuses,
    };
  }
}
