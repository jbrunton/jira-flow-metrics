import { Module } from '@nestjs/common';
import { DataModule } from '@data/data.module';
import { IssuesRepository } from './issues.repository';
import { JiraIssuesRepository } from './jira-issues.repository';
import { JiraFieldsRepository } from './jira-fields.repository';
import { JiraStatusesRepository } from './jira-statuses.repository';
import { DataSetsRepository } from '../data-sets/data-sets.repository';
import { SyncAction } from './sync-action';
import { CycleTimesUseCase } from '@usecases/cycle-times-use-case';

@Module({
  imports: [DataModule],
  providers: [
    IssuesRepository,
    JiraIssuesRepository,
    JiraFieldsRepository,
    JiraStatusesRepository,
    DataSetsRepository,
    SyncAction,
    CycleTimesUseCase,
  ],
  controllers: [],
  exports: [SyncAction, IssuesRepository],
})
export class IssuesModule {}
