export enum StatusCategory {
  ToDo = "To Do",
  InProgress = "In Progress",
  Done = "Done",
}

export enum HierarchyLevel {
  Story = "Story",
  Epic = "Epic",
}

export type Status = {
  jiraId: string;
  name?: string;
  category: StatusCategory;
};

export type Field = {
  jiraId: string;
  name?: string;
};

export type Filter = {
  name: string;
  jql: string;
};

export type TransitionStatus = {
  name?: string;
  category: StatusCategory;
};

export type Transition = {
  date: Date;
  fromStatus: TransitionStatus;
  toStatus: TransitionStatus;
};

// export type SerializedTransition = Omit<Transition, "date"> & {
//   date: string;
// };

export type JiraProject = {
  name: string;
  key: string;
};

export type IssueFlowMetrics = {
  started?: Date;
  completed?: Date;
  cycleTime?: number;
};

export type StartedFlowMetrics = IssueFlowMetrics & {
  started: Date;
};

export type CompletedFlowMetrics = IssueFlowMetrics & {
  completed: Date;
  cycleTime: number;
};

export type Issue = {
  key: string;
  externalUrl: string;
  summary: string;
  issueType?: string;
  hierarchyLevel: HierarchyLevel;
  status?: string;
  statusCategory: StatusCategory;
  resolution?: string;
  parentKey?: string;
  created?: Date;
  transitions: Transition[];
  metrics: IssueFlowMetrics;
};

export type StartedIssue = Issue & {
  metrics: StartedFlowMetrics;
};

export type CompletedIssue = Issue & {
  metrics: CompletedFlowMetrics;
};

export const isStarted = (issue: Issue): issue is StartedIssue =>
  issue.metrics.started !== undefined;

export const isCompleted = (issue: Issue): issue is CompletedIssue =>
  issue.metrics.completed !== undefined &&
  issue.metrics.cycleTime !== undefined;

export abstract class IssuesRepository {
  abstract getIssues(domainId: string, datasetId: string): Promise<Issue[]>;
  abstract setIssues(
    domainId: string,
    datasetId: string,
    issues: Issue[],
  ): Promise<void>;
}
