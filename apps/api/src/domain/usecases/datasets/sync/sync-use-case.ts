import { DatasetsRepository, WorkflowStage } from "@entities/datasets";
import { IssuesRepository } from "@entities/issues";
import { Injectable } from "@nestjs/common";
import { JiraIssuesRepository } from "./jira-issues-repository";
import {
  JiraIssueBuilder,
  StatusBuilder,
  HierarchyLevel,
  StatusCategory,
} from "@jbrunton/flow-metrics";
import { DomainsRepository } from "@entities/domains";
import { sortStatuses } from "./sort-statuses";

@Injectable()
export class SyncUseCase {
  constructor(
    private readonly datasets: DatasetsRepository,
    private readonly issues: IssuesRepository,
    private readonly domains: DomainsRepository,
    private readonly jiraIssues: JiraIssuesRepository,
  ) {}

  async exec(datasetId: string) {
    const dataset = await this.datasets.getDataset(datasetId);
    const domain = await this.domains.getDomain(dataset.domainId);

    const [fields, jiraStatuses] = await Promise.all([
      this.jiraIssues.getFields(domain),
      this.jiraIssues.getStatuses(domain),
    ]);

    const statusBuilder = new StatusBuilder(jiraStatuses);

    const builder = new JiraIssueBuilder(fields, statusBuilder, domain.host);

    const issues = await this.jiraIssues.search(domain, {
      jql: dataset.jql,
      onProgress: () => {},
      builder,
    });

    await this.issues.setIssues(datasetId, issues);

    const stories = issues.filter(
      (issue) => issue.hierarchyLevel === HierarchyLevel.Story,
    );
    const canonicalStatuses = statusBuilder.getStatuses();

    const sortedStatuses = sortStatuses(stories).map((name) =>
      canonicalStatuses.find((status) => status.name === name),
    );

    const getWorkflowStage = (category: StatusCategory): WorkflowStage => ({
      name: category,
      selectByDefault: category === StatusCategory.InProgress,
      statuses: sortedStatuses.filter((status) => status.category === category),
    });

    const workflow = [
      StatusCategory.ToDo,
      StatusCategory.InProgress,
      StatusCategory.Done,
    ].map(getWorkflowStage);

    await this.datasets.updateDataset(datasetId, {
      lastSync: {
        date: new Date(),
        issueCount: issues.length,
      },
      workflow,
    });

    return issues;
  }
}
