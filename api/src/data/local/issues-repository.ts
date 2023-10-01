import { Injectable } from "@nestjs/common";
import { DataError } from "node-json-db";
import { Issue, IssuesRepository } from "@entities/issues";
import { LocalCache } from "@data/database";

@Injectable()
export class LocalIssuesRepository extends IssuesRepository {
  constructor(private readonly cache: LocalCache) {
    super();
  }

  async getIssues(domainId: string, datasetId: string): Promise<Issue[]> {
    console.info("getIssues", domainId, datasetId);
    try {
      const issues = await this.cache.getObject<Record<string, Issue>>(
        issuesPath(domainId, datasetId),
      );
      return Object.values(issues);
    } catch (e) {
      if (e instanceof DataError) {
        return [];
      }
      throw e;
    }
  }

  async setIssues(domainId: string, datasetId: string, issues: Issue[]) {
    await this.cache.delete(issuesPath(domainId, datasetId));
    await this.cache.push(
      issuesPath(domainId, datasetId),
      Object.fromEntries(issues.map((issue) => [issue.key, issue])),
    );
  }
}

const issuesPath = (domainId: string, datasetId: string) =>
  `/issues/${domainId}/${datasetId}`;
