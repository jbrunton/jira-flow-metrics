import { Injectable } from "@nestjs/common";
import { JiraIssueBuilder } from "./issue_builder";
import { Field, Issue, Status } from "@entities/issues";

export type SearchParams = {
  jql: string;
  onProgress: (pageIndex: number, total: number) => void;
  builder: JiraIssueBuilder;
};

@Injectable()
export abstract class JiraIssuesRepository {
  abstract getFields(): Promise<Field[]>;
  abstract getStatuses(): Promise<Status[]>;
  abstract search(params: SearchParams): Promise<Issue[]>;
}
