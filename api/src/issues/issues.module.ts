import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { IssuesController } from './issues.controller';
import { IssuesRepository } from './issues.repository';
import { JiraIssuesRepository } from './jira-issues.repository';
import { JiraFieldsRepository } from './jira-fields.repository';
import { JiraStatusesRepository } from './jira-statuses.repository';
import { DataSetsRepository } from 'src/data-sets/data-sets.repository';

@Module({
  imports: [DataModule],
  providers: [
    IssuesRepository,
    JiraIssuesRepository,
    JiraFieldsRepository,
    JiraStatusesRepository,
    DataSetsRepository,
  ],
  controllers: [IssuesController],
})
export class IssuesModule {}
