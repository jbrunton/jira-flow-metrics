import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export enum HierarchyLevel {
  Story = "Story",
  Epic = "Epic",
}

export type Issue = {
  key: string;
  externalUrl: string;
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
  started?: Date;
  completed?: Date;
  cycleTime?: number;
};

export type CompletedIssue = Issue & {
  completed: Date;
  cycleTime: number;
};

export const isCompleted = (issue: Issue): issue is CompletedIssue => {
  return issue.completed !== undefined && issue.cycleTime !== undefined;
};

export type IssueStatus = {
  name: string;
  category: Issue["statusCategory"];
};

const issuesQueryKey = "issues";

const getIssues = async (dataSetId?: string): Promise<Issue[]> => {
  const response = await axios.get(`/datasets/${dataSetId}/issues`);
  return response.data.map((issue: Issue) => ({
    ...issue,
    created: issue.created ? new Date(issue.created) : undefined,
    started: issue.started ? new Date(issue.started) : undefined,
    completed: issue.completed ? new Date(issue.completed) : undefined,
    transitions: issue.transitions
      ? issue.transitions.map((transition) => ({
          ...transition,
          date: new Date(transition.date),
        }))
      : undefined,
  }));
};

export const useIssues = (dataSetId?: string) => {
  return useQuery({
    queryKey: [issuesQueryKey, dataSetId],
    queryFn: () => getIssues(dataSetId),
    enabled: dataSetId !== undefined,
  });
};

export type DateRange = null | [Date | null, Date | null];

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
      if (!issue.completed) {
        return false;
      }

      if (filter.dates[0] && issue.completed < filter.dates[0]) {
        return false;
      }

      if (filter.dates[1] && issue.completed > filter.dates[1]) {
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
