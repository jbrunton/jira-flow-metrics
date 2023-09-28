import { Injectable } from '@nestjs/common';
import { JiraIssueBuilder } from './issue_builder';
import { Issue } from '@entities/issues';

export type SearchParams = {
  jql: string;
  onProgress: (pageIndex: number, total: number) => void;
  builder: JiraIssueBuilder;
};

@Injectable()
export abstract class JiraIssuesRepository {
  abstract search(params: SearchParams): Promise<Issue[]>;
}
