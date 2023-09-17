import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DataSetsRepository } from './data-sets.repository';
import { ApiProperty } from '@nestjs/swagger';
import { DataSourcesRepository } from './data-sources.repository';
import { JiraIssuesRepository } from 'src/issues/jira-issues.repository';
import { JiraFieldsRepository } from 'src/issues/jira-fields.repository';
import { JiraStatusesRepository } from 'src/issues/jira-statuses.repository';
import { IssuesRepository } from 'src/issues/issues.repository';
import { JiraIssueBuilder } from 'src/issues/issue_builder';

class CreateDataSetBody {
  @ApiProperty()
  name: string;

  @ApiProperty()
  jql: string;
}

@Controller('datasets')
export class DataSetsController {
  constructor(
    private readonly dataSets: DataSetsRepository,
    private readonly dataSources: DataSourcesRepository,
    private readonly jiraIssues: JiraIssuesRepository,
    private readonly fieldsRepo: JiraFieldsRepository,
    private readonly statusesRepo: JiraStatusesRepository,
    private readonly issues: IssuesRepository,
  ) {}

  @Get()
  async getDataSets(@Query('domainId') domainId: string) {
    return this.dataSets.getDataSets(domainId);
  }

  @Get('sources')
  async getDataSources(@Query('query') query: string) {
    return this.dataSources.getDataSources(query);
  }

  @Post()
  async createDataSet(
    @Query('domainId') domainId,
    @Body() dataSet: CreateDataSetBody,
  ) {
    return await this.dataSets.addDataSet(domainId, dataSet);
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

  @Get(':dataset/issues')
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
}
