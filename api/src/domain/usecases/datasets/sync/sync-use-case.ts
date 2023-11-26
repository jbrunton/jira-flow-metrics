import { DatasetsRepository } from "@entities/datasets";
import { IssuesRepository } from "@entities/issues";
import { Injectable } from "@nestjs/common";
import { JiraIssuesRepository } from "./jira-issues-repository";
import { JiraIssueBuilder } from "./issue_builder";
import { DomainsRepository } from "@entities/domains";

@Injectable()
export class SyncUseCase {
  constructor(
    private readonly datasets: DatasetsRepository,
    private readonly issues: IssuesRepository,
    private readonly domains: DomainsRepository,
    private readonly jiraIssues: JiraIssuesRepository,
  ) {}

  async exec(datasetId: string) {
    console.info("sync.exec", datasetId);
    const dataset = await this.datasets.getDataset(datasetId);
    const domain = await this.domains.getDomain(dataset.domainId);

    const [fields, statuses] = await Promise.all([
      this.jiraIssues.getFields(domain),
      this.jiraIssues.getStatuses(domain),
    ]);

    const builder = new JiraIssueBuilder(fields, statuses, domain.host);
    const issues = await this.jiraIssues.search(domain, {
      jql: dataset.jql,
      onProgress: () => {},
      builder,
    });

    await this.issues.setIssues(datasetId, issues);
    await this.datasets.updateDataset(datasetId, {
      lastSync: {
        date: new Date(),
        issueCount: issues.length,
      },
    });

    return issues;
  }
}
