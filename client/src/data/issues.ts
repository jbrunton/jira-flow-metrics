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

const getIssues = async (domainId?: string, dataSetId?: string): Promise<Issue[]> => {
  const response = await axios.get(`http://localhost:3000/api/issues/${domainId}/${dataSetId}`);
  return response.data;
}

export const useIssues = (domainId?: string, dataSetId?: string) => {
  return useQuery({
    queryKey: ['issues', dataSetId],
    queryFn: () => getIssues(domainId, dataSetId),
    enabled: domainId !== undefined && dataSetId !== undefined,
  });
}
