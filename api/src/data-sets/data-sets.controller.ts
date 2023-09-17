import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DataSetsRepository } from './data-sets.repository';
import { ApiProperty } from '@nestjs/swagger';
import { DataSourcesRepository } from './data-sources.repository';

class CreateDataSetBody {
  @ApiProperty()
  name: string;

  @ApiProperty()
  jql: string;
}

@Controller('datasets/:domainId')
export class DataSetsController {
  constructor(
    private readonly dataSets: DataSetsRepository,
    private readonly dataSources: DataSourcesRepository,
  ) {}

  @Get()
  async getDataSets(@Param('domainId') domainId: string) {
    return this.dataSets.getDataSets(domainId);
  }

  @Get('sources')
  async getDataSources(@Query('query') query: string) {
    return this.dataSources.getDataSources(query);
  }

  @Post()
  async createDataSet(
    @Param('domainId') domainId,
    @Body() dataSet: CreateDataSetBody,
  ) {
    return await this.dataSets.addDataSet(domainId, dataSet);
  }
}
