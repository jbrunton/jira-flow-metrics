import { Injectable } from '@nestjs/common';
import { DataError, JsonDB } from 'node-json-db';
import { Issue } from './types';

@Injectable()
export class IssuesRepository {
  constructor(private readonly cache: JsonDB) {}

  async getIssues(dataSetId: string): Promise<Issue[]> {
    try {
      const issues = await this.cache.getObject<Record<string, Issue>>(
        issuesPath(dataSetId),
      );
      return Object.values(issues);
    } catch (e) {
      if (e instanceof DataError) {
        return [];
      }
      throw e;
    }
  }

  async setIssues(dataSetId: string, issues: Issue[]) {
    await this.cache.delete(issuesPath(dataSetId));
    await this.cache.push(
      issuesPath(dataSetId),
      Object.fromEntries(issues.map((issue) => [issue.key, issue])),
    );
    // await this.cache.push(`/dataSets/${id}`, dataSet);
    // return dataSet;
  }
}

const issuesPath = (dataSetId: string) => `/issues/${dataSetId}`;

// const issuePath = (dataSetId: string, issueKey: string) =>
//   `${issuesPath(dataSetId)}/${issueKey}}`;
