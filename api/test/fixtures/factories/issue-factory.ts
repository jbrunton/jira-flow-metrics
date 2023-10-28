import { HierarchyLevel, Issue, StatusCategory } from "@entities/issues";

let issueCount = 100;

export const buildIssue = (params: Partial<Issue>): Issue => {
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
    metrics: {},
  };
  return {
    ...defaults,
    ...params,
  };
};
