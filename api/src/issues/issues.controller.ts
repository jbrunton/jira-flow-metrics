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
  constructor(private readonly issues: IssuesRepository) {}

  // @Get(':dataset')
  // async getIssues(
  //   @Query('domainId') domainId: string,
  //   @Param('dataset') dataSetId: string,
  // ) {
  //   const issues = await this.issues.getIssues(domainId, dataSetId);
  //   return issues.map((issue) => ({
  //     jiraUrl: `${process.env.JIRA_HOST}/browse/${issue.key}`,
  //     ...issue,
  //   }));
  // }

  // @Get('sources')
  // async getDataSources(@Query('query') query: string) {
  //   return this.dataSources.getDataSources(query);
  // }

  // @Post()
  // async createDataSet(@Body() dataSet: CreateDataSetBody) {
  //   return await this.dataSets.addDataSet(dataSet);
  // }
}
