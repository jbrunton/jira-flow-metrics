import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { DataSetsController } from './data-sets.controller';
import { DataSetsRepository } from './data-sets.repository';
import { DataSourcesRepository } from './data-sources.repository';
import { JiraIssuesRepository } from '../issues/jira-issues.repository';
import { JiraFieldsRepository } from '../issues/jira-fields.repository';
import { JiraStatusesRepository } from '../issues/jira-statuses.repository';
import { IssuesRepository } from '../issues/issues.repository';

@Module({
  imports: [DataModule],
  providers: [
    DataSetsRepository,
    DataSourcesRepository,
    JiraIssuesRepository,
    JiraFieldsRepository,
    JiraStatusesRepository,
    IssuesRepository,
  ],
  controllers: [DataSetsController],
})
export class DataSetsModule {}
