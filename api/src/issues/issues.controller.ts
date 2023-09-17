import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { IssuesRepository } from './issues.repository';
import { JiraIssuesRepository } from './jira-issues.repository';
import { DataSetsRepository } from 'src/data-sets/data-sets.repository';
import { JiraIssueBuilder } from './issue_builder';
import { JiraFieldsRepository } from './jira-fields.repository';
import { JiraStatusesRepository } from './jira-statuses.repository';

// class CreateDataSetBody {
//   @ApiProperty()
//   name: string;

//   @ApiProperty()
//   jql: string;
// }

@Controller('issues')
export class IssuesController {
  constructor(
    private readonly issues: IssuesRepository,
    private readonly jiraIssues: JiraIssuesRepository,
    private readonly dataSets: DataSetsRepository,
    private readonly fieldsRepo: JiraFieldsRepository,
    private readonly statusesRepo: JiraStatusesRepository,
  ) {}

  @Get(':dataset')
  async getIssues(
    @Query('domainId') domainId: string,
    @Param('dataset') dataSetId: string,
  ) {
    const issues = await this.issues.getIssues(domainId, dataSetId);
    return issues.map((issue) => ({
      jiraUrl: `${process.env.JIRA_HOST}/browse/${issue.key}`,
      ...issue,
    }));
  }

  @Put(':dataset/sync')
  async sync(
    @Query('domainId') domainId: string,
    @Param('dataset') dataSetId: string,
  ) {
    const dataSet = await this.dataSets.getDataSet(domainId, dataSetId);
    const fields = await this.fieldsRepo.getFields();
    const statuses = await this.statusesRepo.getStatuses();
    const builder = new JiraIssueBuilder(fields, statuses);
    const issues = await this.jiraIssues.search({
      jql: dataSet.jql,
      onProgress: () => {},
      builder,
    });
    await this.issues.setIssues(domainId, dataSetId, issues);
    return issues;
  }

  // @Get('sources')
  // async getDataSources(@Query('query') query: string) {
  //   return this.dataSources.getDataSources(query);
  // }

  // @Post()
  // async createDataSet(@Body() dataSet: CreateDataSetBody) {
  //   return await this.dataSets.addDataSet(dataSet);
  // }
}
