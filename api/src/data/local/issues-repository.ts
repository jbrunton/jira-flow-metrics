import { Injectable } from "@nestjs/common";
import { DataError } from "node-json-db";
import { Issue, IssuesRepository } from "@entities/issues";
import { LocalCache } from "@data/database";

@Injectable()
export class LocalIssuesRepository extends IssuesRepository {
  constructor(private readonly cache: LocalCache) {
    super();
  }

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
  }
}

const issuesPath = (domainId: string, dataSetId: string) =>
  `/issues/${domainId}/${dataSetId}`;
