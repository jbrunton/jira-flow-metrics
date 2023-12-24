import { Injectable } from "@nestjs/common";
import { JiraIssueBuilder } from "./issue_builder";
import { Field, Issue, Status } from "@entities/issues";
import { Domain } from "@entities/domains";

export type SearchParams = {
  jql: string;
  onProgress: (pageIndex: number, total: number) => void;
  builder: JiraIssueBuilder;
};

@Injectable()
export abstract class JiraIssuesRepository {
  abstract getFields(domain: Domain): Promise<Field[]>;
  abstract getStatuses(domain: Domain): Promise<Status[]>;
  abstract search(domain: Domain, params: SearchParams): Promise<Issue[]>;
}
