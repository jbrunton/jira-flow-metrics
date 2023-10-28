import { Version3Client } from "jira.js";
import { mapLimit } from "async";
import { isNil, range, reject } from "rambda";
import { Injectable } from "@nestjs/common";
import { Field, Issue, Status, StatusCategory } from "@entities/issues";
import { JiraIssuesRepository } from "@usecases/datasets/sync/jira-issues-repository";
import { JiraIssueBuilder } from "@usecases/datasets/sync/issue_builder";

export type SearchParams = {
  jql: string;
  onProgress: (pageIndex: number, total: number) => void;
  builder: JiraIssueBuilder;
};

@Injectable()
export class HttpJiraIssuesRepository extends JiraIssuesRepository {
  constructor(private readonly client: Version3Client) {
    super();
  }

  async getFields(): Promise<Field[]> {
    const jiraFields = await this.client.issueFields.getFields();
    return reject(isNil)(
      jiraFields.map((field) => {
        if (field.id === undefined) {
          console.warn(`Missing id for field ${field}`);
          return null;
        }

        return {
          jiraId: field.id,
          name: field.name,
        };
      }),
    );
  }

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

  async search({ jql, onProgress, builder }: SearchParams): Promise<Issue[]> {
    const searchParams = {
      jql,
      expand: ["changelog"],
      fields: builder.getRequiredFields(),
    };

    onProgress(0, 1);

    const firstPage =
      await this.client.issueSearch.searchForIssuesUsingJqlPost(searchParams);

    const maxResults = firstPage.maxResults;
    const total = firstPage.total;

    if (total === undefined || maxResults === undefined) {
      throw new Error(
        `Response missing fields: total=${total}, maxResults: ${maxResults}`,
      );
    }

    const pageCount = Math.ceil(total / maxResults);

    let progress = 0;
    const incrementProgress = () => {
      progress += 1;
      onProgress(progress, pageCount);
    };
    incrementProgress();

    const remainingPages = await mapLimit(
      range(1, pageCount),
      5,
      async (pageIndex: number) => {
        const page = await this.client.issueSearch.searchForIssuesUsingJqlPost({
          ...searchParams,
          startAt: pageIndex * maxResults,
        });
        incrementProgress();
        return page;
      },
    );

    const pages = [firstPage, ...remainingPages];
    const issues = pages.reduce<Issue[]>((issues, page) => {
      if (!page.issues) {
        return issues;
      }

      const pageIssues = page.issues.map((issue) => builder.build(issue));

      return [...issues, ...pageIssues];
    }, []);

    return issues;
  }
}
