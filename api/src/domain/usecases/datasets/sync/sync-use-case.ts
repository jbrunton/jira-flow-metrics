import { DatasetsRepository } from "@entities/datasets";
import { HierarchyLevel, IssuesRepository } from "@entities/issues";
import { Injectable } from "@nestjs/common";
import { JiraIssuesRepository } from "./jira-issues-repository";
import { JiraIssueBuilder } from "./issue_builder";
import { DomainsRepository } from "@entities/domains";
import { sortStatuses } from "./sort-statuses";
import { StatusBuilder } from "./status-builder-spec";

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

    await this.datasets.updateDataset(datasetId, {
      lastSync: {
        date: new Date(),
        issueCount: issues.length,
      },
      statuses: sortedStatuses,
    });

    return issues;
  }
}
