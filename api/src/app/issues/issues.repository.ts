import { Injectable } from '@nestjs/common';
import { DataError } from 'node-json-db';
import { Issue } from '../../domain/entities/issues';
import { LocalCache } from '../../data/database';

@Injectable()
export class IssuesRepository {
  constructor(private readonly cache: LocalCache) {}

  async getIssues(domainId: string, dataSetId: string): Promise<Issue[]> {
    try {
      const issues = await this.cache.getObject<Record<string, Issue>>(
        issuesPath(domainId, dataSetId),
      );
      return Object.values(issues);
    } catch (e) {
      if (e instanceof DataError) {
        return [];
      }
      throw e;
    }
  }

  async setIssues(domainId: string, dataSetId: string, issues: Issue[]) {
    await this.cache.delete(issuesPath(domainId, dataSetId));
    await this.cache.push(
      issuesPath(domainId, dataSetId),
      Object.fromEntries(issues.map((issue) => [issue.key, issue])),
    );
    // await this.cache.push(`/dataSets/${id}`, dataSet);
    // return dataSet;
  }
}

const issuesPath = (domainId: string, dataSetId: string) =>
  `/issues/${domainId}/${dataSetId}`;

// const issuePath = (dataSetId: string, issueKey: string) =>
//   `${issuesPath(dataSetId)}/${issueKey}}`;
