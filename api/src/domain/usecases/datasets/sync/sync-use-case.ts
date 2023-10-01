import { DatasetsRepository } from "@entities/datasets";
import { IssuesRepository } from "@entities/issues";
import { Injectable } from "@nestjs/common";
import { CycleTimesUseCase } from "@usecases/cycle-times-use-case";
import { JiraFieldsRepository } from "./jira-fields-repository";
import { JiraStatusesRepository } from "./jira-statuses-repository";
import { JiraIssuesRepository } from "./jira-issues-repository";
import { JiraIssueBuilder } from "./issue_builder";
import { DomainsRepository } from "@entities/domains";

@Injectable()
export class SyncUseCase {
  constructor(
    private readonly datasets: DatasetsRepository,
    private readonly issues: IssuesRepository,
    private readonly domains: DomainsRepository,
    private readonly jiraFields: JiraFieldsRepository,
    private readonly jiraStatuses: JiraStatusesRepository,
    private readonly jiraIssues: JiraIssuesRepository,
    private readonly cycleTimesUseCase: CycleTimesUseCase,
  ) {}

  async exec(domainId: string, datasetId: string) {
    const [domain, dataset, fields, statuses] = await Promise.all([
      this.domains.getDomain(domainId),
      this.datasets.getDataset(domainId, datasetId),
      this.jiraFields.getFields(),
      this.jiraStatuses.getStatuses(),
    ]);

    const builder = new JiraIssueBuilder(fields, statuses, domain.host);
    const issues = await this.jiraIssues.search({
      jql: dataset.jql,
      onProgress: () => {},
      builder,
    });

    const estimatedIssues = this.cycleTimesUseCase.exec(issues);

    await this.issues.setIssues(domainId, datasetId, estimatedIssues);
    return estimatedIssues;
  }
}
