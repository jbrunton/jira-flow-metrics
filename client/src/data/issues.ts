import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Issue = {
  key: string;
  summary: string;
  status: string;
  resolution: string;
  statusCategory: "To Do" | "In Progress" | "Done";
  jiraUrl: string;
}

const issuesQueryKey = 'issues';

const getIssues = async (dataSetId?: string): Promise<Issue[]> => {
  const response = await axios.get(`/datasets/${dataSetId}/issues`);
  return response.data;
}

export const useIssues = (dataSetId?: string) => {
  return useQuery({
    queryKey: [issuesQueryKey, dataSetId],
    queryFn: () => getIssues(dataSetId),
    enabled: dataSetId !== undefined,
  });
}
