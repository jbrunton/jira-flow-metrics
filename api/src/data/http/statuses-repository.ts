import { Injectable } from "@nestjs/common";
import { Version3Client } from "jira.js";
import { Status, StatusCategory } from "@entities/issues";
import { isNil, reject } from "rambda";

@Injectable()
export class HttpJiraStatusesRepository {
  constructor(private readonly client: Version3Client) {}

  async getStatuses(): Promise<Status[]> {
    const jiraStatuses = await this.client.workflowStatuses.getStatuses();
    return reject(isNil)(
      jiraStatuses.map((status) => {
        if (status.id === undefined) {
          console.warn(`Missing id for status ${status}`);
          return null;
        }

        const category = status.statusCategory?.name as StatusCategory;

        return {
          jiraId: status.id,
          name: status.name,
          category,
        };
      }),
    );
  }
}