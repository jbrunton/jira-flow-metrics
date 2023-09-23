import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export enum HierarchyLevel {
  Story = "Story",
  Epic = "Epic",
}

export type Issue = {
  key: string;
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
  jiraUrl: string;
  started?: Date;
  completed?: Date;
  cycleTime?: number;
}

export type CompleteIssue = Issue & {
  completed: Date;
  cycleTime: number;
}

export const isCompleted = (issue: Issue): issue is CompleteIssue => {
  return issue.completed !== undefined && issue.cycleTime !== undefined;
}

export type IssueStatus = {
  name: string;
  category: Issue["statusCategory"];
};

const issuesQueryKey = 'issues';

const getIssues = async (dataSetId?: string): Promise<Issue[]> => {
  const response = await axios.get(`/datasets/${dataSetId}/issues`);
  return response.data.map((issue: Issue) => ({
    ...issue,
    created: issue.created ? new Date(issue.created) : undefined,
    started: issue.started ? new Date(issue.started) : undefined,
    completed: issue.completed ? new Date(issue.completed) : undefined,
    transitions: issue.transitions ? issue.transitions.map(transition => ({
      ...transition,
      date: new Date(transition.date),
    })) : undefined,
  }));
}

export const useIssues = (dataSetId?: string) => {
  return useQuery({
    queryKey: [issuesQueryKey, dataSetId],
    queryFn: () => getIssues(dataSetId),
    enabled: dataSetId !== undefined,
  });
}
