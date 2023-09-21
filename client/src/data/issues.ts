import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Issue = {
  key: string;
  summary: string;
  status: string;
  resolution: string;
  statusCategory: "To Do" | "In Progress" | "Done";
  jiraUrl: string;
  started?: Date;
  completed?: Date;
  cycleTime?: number;
}

const issuesQueryKey = 'issues';

const getIssues = async (dataSetId?: string): Promise<Issue[]> => {
  const response = await axios.get(`/datasets/${dataSetId}/issues`);
  return response.data.map((issue: Issue) => ({
    ...issue,
    started: issue.started ? new Date(issue.started) : undefined,
    completed: issue.completed ? new Date(issue.completed) : undefined,
  }));
}

export const useIssues = (dataSetId?: string) => {
  return useQuery({
    queryKey: [issuesQueryKey, dataSetId],
    queryFn: () => getIssues(dataSetId),
    enabled: dataSetId !== undefined,
  });
}
