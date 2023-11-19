import { Version3Models } from "jira.js";
import { reject, isNil } from "rambda";
import {
  Field,
  HierarchyLevel,
  Issue,
  Status,
  StatusCategory,
  Transition,
} from "@entities/issues";
import { compareAsc, differenceInSeconds } from "date-fns";

export type TransitionContext = Omit<Transition, "timeInStatus">;

const secondsInDay = 60 * 60 * 24;

export class JiraIssueBuilder {
  private readonly statusCategories: { [externalId: string]: string } = {};
  private readonly epicLinkFieldId?: string;
  private readonly parentFieldId?: string;

  constructor(
    fields: Field[],
    statuses: Status[],
    private readonly host: string,
  ) {
    for (const status of statuses) {
      this.statusCategories[status.jiraId] = status.category;
    }

    this.epicLinkFieldId = fields.find((field) => field.name === "Epic Link")
      ?.jiraId;
    this.parentFieldId = fields.find((field) => field.name === "Parent")
      ?.jiraId;
  }

  getRequiredFields(): string[] {
    return [
      "key",
      "summary",
      "issuetype",
      "status",
      "resolution",
      "created",
      this.epicLinkFieldId,
      this.parentFieldId,
    ];
  }

  build(json: Version3Models.Issue) {
    const key = json.key;
    const status = json.fields.status.name;
    const statusCategory = json.fields.status.statusCategory
      ?.name as StatusCategory;
    const issueType = json.fields.issuetype?.name;
    const resolution = json.fields.resolution?.name;
    const created = new Date(json.fields.created);
    const hierarchyLevel =
      issueType === "Epic" ? HierarchyLevel.Epic : HierarchyLevel.Story;

    if (!statusCategory) {
      throw new Error(`Status category for issue ${json.key} is undefined`);
    }

    const transitions = this.buildTransitions(
      json,
      created,
      status,
      statusCategory,
    );

    const epicKey = json["fields"][this.epicLinkFieldId] as string;
    const parentKey = json["fields"][this.parentFieldId]?.key as string;

    const issue: Issue = {
      key,
      externalUrl: `https://${this.host}/browse/${key}`,
      summary: json.fields.summary,
      issueType,
      resolution,
      hierarchyLevel,
      status,
      statusCategory,
      created,
      parentKey: epicKey ?? parentKey,
      transitions,
      metrics: {},
    };
    return issue;
  }

  private buildTransitions(
    json: Version3Models.Issue,
    created: Date,
    status: string,
    statusCategory: StatusCategory,
  ): Transition[] {
    const transitions: TransitionContext[] = reject(isNil)(
      json.changelog?.histories?.map((event) => {
        const statusChange = event.items?.find(
          (item) => item.field == "status",
        );
        if (!statusChange) {
          return null;
        }

        const fromStatus = {
          name: titleize(statusChange.fromString),
          category: this.statusCategories[
            statusChange.from ?? ""
          ] as StatusCategory,
        };

        const toStatus = {
          name: titleize(statusChange.toString),
          category: this.statusCategories[
            statusChange.to ?? ""
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
          date: new Date(Date.parse(event.created ?? "")),
          fromStatus,
          toStatus,
        };
      }),
    );

    return buildTransitions(transitions, created, status, statusCategory);
  }
}

const titleize = (text: string): string => {
  return text.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (x) => x.toUpperCase());
};

export const buildTransitions = (
  transitions: TransitionContext[],
  created: Date,
  status: string,
  statusCategory: StatusCategory,
): Transition[] => {
  const sortedTransitions = transitions.sort((t1, t2) =>
    compareAsc(t1.date, t2.date.getTime()),
  );

  const createdTransition: TransitionContext =
    sortedTransitions.length > 0
      ? {
          fromStatus: {
            name: "Created",
            category: StatusCategory.ToDo,
          },
          date: created,
          toStatus: sortedTransitions[0].fromStatus,
        }
      : {
          fromStatus: {
            name: "Created",
            category: StatusCategory.ToDo,
          },
          date: created,
          toStatus: {
            name: status,
            category: statusCategory,
          },
        };

  return [createdTransition, ...sortedTransitions].map(
    (transition, index, transitions): Transition => {
      const nextTransitionDate =
        index < transitions.length - 1
          ? transitions[index + 1].date
          : new Date();
      const timeInStatus =
        differenceInSeconds(nextTransitionDate, transition.date) / secondsInDay;
      return {
        timeInStatus,
        ...transition,
      };
    },
  );
};
