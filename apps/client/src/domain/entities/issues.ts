export enum HierarchyLevel {
  Story = "Story",
  Epic = "Epic",
}

export type IssueFlowMetrics = {
  started?: Date;
  completed?: Date;
  cycleTime?: number;
};

export type CompletedIssueMetrics = IssueFlowMetrics & {
  completed: Date;
  cycleTime: number;
};

export type Transition = {
  date: Date;
  until: Date;
  fromStatus: IssueStatus;
  toStatus: IssueStatus;
  timeInStatus: number;
};

export type Issue = {
  key: string;
  externalUrl: string;
  parentKey?: string;
  parent?: Issue;
  summary: string;
  status: string;
  resolution?: string;
  issueType: string;
  statusCategory: "To Do" | "In Progress" | "Done";
  hierarchyLevel: HierarchyLevel;
  created: Date;
  transitions: Transition[];
  labels: string[];
  assignee?: string;
  components: string[];
  metrics: IssueFlowMetrics;
  sortIndex?: number;
};

export type CompletedIssue = Issue & {
  metrics: CompletedIssueMetrics;
};

export const isCompleted = (issue: Issue): issue is CompletedIssue =>
  issue.metrics.completed !== undefined &&
  issue.metrics.cycleTime !== undefined &&
  issue.metrics.cycleTime > 0;

export type IssueStatus = {
  name: string;
  category: Issue["statusCategory"];
};
