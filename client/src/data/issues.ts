import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

export type Issue = {
  key: string;
  externalUrl: string;
  parentKey?: string;
  summary: string;
  status: string;
  resolution: string;
  issueType: string;
  statusCategory: "To Do" | "In Progress" | "Done";
  hierarchyLevel: HierarchyLevel;
  created: Date;
  transitions: {
    date: Date;
    fromStatus: IssueStatus;
    toStatus: IssueStatus;
  }[];
  metrics: IssueFlowMetrics;
};

export type CompletedIssue = Issue & {
  metrics: CompletedIssueMetrics;
};

export const isCompleted = (issue: Issue): issue is CompletedIssue =>
  issue.metrics.completed !== undefined &&
  issue.metrics.cycleTime !== undefined;

export type IssueStatus = {
  name: string;
  category: Issue["statusCategory"];
};

const issuesQueryKey = "issues";

const getIssues = async (dataSetId?: string): Promise<Issue[]> => {
  const response = await axios.get(`/datasets/${dataSetId}/issues`);
  return response.data.map((issue: Issue) => {
    const metrics: IssueFlowMetrics = {
      started: parseDate(issue.metrics.started),
      completed: parseDate(issue.metrics.completed),
      cycleTime: issue.metrics.cycleTime,
    };
    return {
      ...issue,
      metrics,
      created: parseDate(issue.created),
      transitions: issue.transitions
        ? issue.transitions.map((transition) => ({
            ...transition,
            date: new Date(transition.date),
          }))
        : undefined,
    };
  });
};

const parseDate = (date: string | Date | undefined): Date | undefined => {
  return date ? new Date(date) : undefined;
};

export const useIssues = (dataSetId?: string) => {
  return useQuery({
    queryKey: [issuesQueryKey, dataSetId],
    queryFn: () => getIssues(dataSetId),
    enabled: dataSetId !== undefined,
  });
};

export type DateRange = null | [Date, Date];

export type IssueFilter = {
  hierarchyLevel?: HierarchyLevel;
  resolutions?: string[];
  dates?: DateRange;
};

export const filterIssues = (issues: Issue[], filter: IssueFilter): Issue[] => {
  return issues.filter((issue) => {
    if (filter.hierarchyLevel) {
      if (issue.hierarchyLevel !== filter.hierarchyLevel) {
        return false;
      }
    }

    if (filter.resolutions && filter.resolutions.length > 0) {
      if (!filter.resolutions.includes(issue.resolution)) {
        return false;
      }
    }

    if (filter.dates) {
      if (!issue.metrics.completed) {
        return false;
      }

      if (filter.dates[0] && issue.metrics.completed < filter.dates[0]) {
        return false;
      }

      if (filter.dates[1] && issue.metrics.completed > filter.dates[1]) {
        return false;
      }
    }

    return true;
  });
};

export const filterCompletedIssues = (
  issues: Issue[],
  filter: IssueFilter,
): CompletedIssue[] => {
  return filterIssues(issues, filter).filter(isCompleted);
};
