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

const getIssues = async (dataSetId?: string): Promise<Issue[]> => {
  const response = await axios.get(`http://localhost:3000/api/issues/${dataSetId}`);
  return response.data;
}

export const useIssues = (dataSetId?: string) => {
  return useQuery({
    queryKey: ['issues', dataSetId],
    queryFn: () => getIssues(dataSetId),
    enabled: dataSetId !== undefined,
  });
}
