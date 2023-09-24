import { JiraFieldsRepository } from './jira-fields.repository';
import { DataSetsRepository } from '../data-sets/data-sets.repository';
import { JiraStatusesRepository } from './jira-statuses.repository';
import { IssuesRepository } from './issues.repository';
import { JiraIssueBuilder } from './issue_builder';
import { JiraIssuesRepository } from './jira-issues.repository';
import { Injectable } from '@nestjs/common';
import { CycleTimesUseCase } from '@usecases/cycle-times-use-case';

@Injectable()
export class SyncAction {
  constructor(
    private readonly dataSets: DataSetsRepository,
    private readonly issues: IssuesRepository,
    private readonly jiraFields: JiraFieldsRepository,
    private readonly jiraStatuses: JiraStatusesRepository,
    private readonly jiraIssues: JiraIssuesRepository,
    private readonly cycleTimesUseCase: CycleTimesUseCase,
  ) {}

  async exec(domainId: string, dataSetId: string) {
    const dataSet = await this.dataSets.getDataSet(domainId, dataSetId);
    const fields = await this.jiraFields.getFields();
    const statuses = await this.jiraStatuses.getStatuses();
    const builder = new JiraIssueBuilder(fields, statuses);
    const issues = await this.jiraIssues.search({
      jql: dataSet.jql,
      onProgress: () => {},
      builder,
    });

    const estimatedIssues = this.cycleTimesUseCase.exec(issues);

    await this.issues.setIssues(domainId, dataSetId, estimatedIssues);
    return estimatedIssues;
  }
}
