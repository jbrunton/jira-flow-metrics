import { Version3Models } from 'jira.js';
import { reject, isNil } from 'rambda';
import {
  Field,
  HierarchyLevel,
  Issue,
  Status,
  StatusCategory,
  Transition,
} from '../domain/entities/issues';

export class JiraIssueBuilder {
  private readonly statusCategories: { [externalId: string]: string } = {};
  private readonly epicLinkFieldId?: string;
  private readonly parentFieldId?: string;

  constructor(fields: Field[], statuses: Status[]) {
    for (const status of statuses) {
      this.statusCategories[status.jiraId] = status.category;
    }

    this.epicLinkFieldId = fields.find((field) => field.name === 'Epic Link')
      ?.jiraId;
    this.parentFieldId = fields.find((field) => field.name === 'Parent')
      ?.jiraId;
  }

  getRequiredFields(): string[] {
    return [
      'key',
      'summary',
      'issuetype',
      'status',
      'resolution',
      'created',
      this.epicLinkFieldId,
      this.parentFieldId,
    ];
  }

  build(json: Version3Models.Issue) {
    const status = json.fields.status.name;
    const statusCategory = json.fields.status.statusCategory
      ?.name as StatusCategory;
    const issueType = json.fields.issuetype?.name;
    const resolution = json.fields.resolution?.name;
    const created = new Date(json.fields.created);
    const hierarchyLevel =
      issueType === 'Epic' ? HierarchyLevel.Epic : HierarchyLevel.Story;

    if (!statusCategory) {
      throw new Error(`Status category for issue ${json.key} is undefined`);
    }

    const transitions = this.buildTransitions(json);

    const epicKey = json['fields'][this.epicLinkFieldId] as string;
    const parentKey = json['fields'][this.parentFieldId]?.key as string;

    const issue: Issue = {
      key: json.key,
      summary: json.fields.summary,
      issueType,
      resolution,
      hierarchyLevel,
      status,
      statusCategory,
      created,
      parentKey: epicKey ?? parentKey,
      transitions,
    };
    return issue;
  }

  buildTransitions(json: Version3Models.Issue): Transition[] {
    const transitions: Transition[] = reject(isNil)(
      json.changelog?.histories?.map((event) => {
        const statusChange = event.items?.find(
          (item) => item.field == 'status',
        );
        if (!statusChange) {
          return null;
        }

        const fromStatus = {
          name: statusChange.fromString,
          category: this.statusCategories[
            statusChange.from ?? ''
          ] as StatusCategory,
        };

        const toStatus = {
          name: statusChange.toString,
          category: this.statusCategories[
            statusChange.to ?? ''
          ] as StatusCategory,
        };
        if (!fromStatus.category) {
          // console.warn(
          //   `Could not find status with id ${statusChange.from} (${statusChange.fromString})`
          // );
        }
        if (!toStatus.category) {
          // console.warn(
          //   `Could not find status with id ${statusChange.to} (${statusChange.toString})`
          // );
        }
        return {
          date: new Date(Date.parse(event.created ?? '')),
          fromStatus,
          toStatus,
        };
      }),
    );

    return transitions.sort((t1, t2) => t1.date.getTime() - t2.date.getTime());
  }
}
