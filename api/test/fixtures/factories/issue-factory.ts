import { HierarchyLevel, Issue, StatusCategory } from "@entities/issues";
import {
  TransitionContext,
  buildTransitions,
} from "@usecases/datasets/sync/issue_builder";

let issueCount = 100;

type IssueParams = Partial<Omit<Issue, "transitions">> & {
  transitions: TransitionContext[];
};

export const buildIssue = (params: IssueParams): Issue => {
  ++issueCount;
  const key = `TEST-${issueCount}`;
  const defaults: Issue = {
    key,
    externalUrl: `https://jira.example.com/browse/${key}`,
    hierarchyLevel: HierarchyLevel.Story,
    summary: `Some issue ${issueCount}`,
    status: "Backlog",
    statusCategory: StatusCategory.ToDo,
    transitions: [],
    labels: [],
    components: [],
    metrics: {},
    created: new Date(),
  };

  const result = {
    ...defaults,
    ...params,
  };

  const transitions = buildTransitions(
    result.transitions,
    result.created,
    result.status,
    result.statusCategory,
  );

  return {
    ...result,
    transitions,
  };
};
