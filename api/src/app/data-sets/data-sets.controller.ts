import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DataSetsRepository } from './data-sets.repository';
import { ApiProperty } from '@nestjs/swagger';
import { DataSourcesRepository } from './data-sources.repository';
import { IssuesRepository } from '../issues/issues.repository';
import { SyncAction } from '../issues/sync-action';
import { DomainsRepository } from '@data/domains.repository';

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
    private readonly issues: IssuesRepository,
    private readonly syncAction: SyncAction,
    private readonly domains: DomainsRepository,
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
    return this.syncAction.exec(domainId, dataSetId);
  }

  @Get(':dataset/issues')
  async getIssues(
    @Query('domainId') domainId: string,
    @Param('dataset') dataSetId: string,
  ) {
    const domains = await this.domains.getDomains();
    const domain = domains.find((domain) => domain.id === domainId);
    const issues = await this.issues.getIssues(domainId, dataSetId);
    return issues.map((issue) => ({
      jiraUrl: `https://${domain.host}/browse/${issue.key}`,
      ...issue,
    }));
  }
}
