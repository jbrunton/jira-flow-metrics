import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  HierarchyLevel,
  Issue,
  IssueFlowMetrics,
  TransitionStatus,
} from "@jbrunton/flow-metrics";

const issuesQueryKey = "issues";

const getIssues = async (
  datasetId: string | undefined,
  includeWaitTime: boolean,
  statuses?: string[],
): Promise<Issue[]> => {
  let url = `/datasets/${datasetId}/issues?includeWaitTime=${includeWaitTime}`;
  if (statuses) {
    url += `&statuses=${statuses.join()}`;
  }
  const response = await axios.get(url);
  return response.data.map((issue: Issue) => {
    const metrics: IssueFlowMetrics = {
      ...issue.metrics,
      started: parseDate(issue.metrics.started),
      completed: parseDate(issue.metrics.completed),
    };
    return {
      ...issue,
      metrics,
      created: parseDate(issue.created),
      transitions: issue.transitions
        ? issue.transitions.map((transition) => ({
            ...transition,
            date: new Date(transition.date),
            until: new Date(transition.until),
          }))
        : undefined,
    };
  });
};

const parseDate = (date: string | Date | undefined): Date | undefined => {
  return date ? new Date(date) : undefined;
};

export const useIssues = (
  datasetId: string | undefined,
  includeWaitTime: boolean,
  statuses?: string[],
) => {
  return useQuery({
    queryKey: [issuesQueryKey, datasetId, includeWaitTime, statuses],
    queryFn: () => getIssues(datasetId, includeWaitTime, statuses),
    enabled: datasetId !== undefined && includeWaitTime !== undefined,
  });
};

export type DatasetStatuses = {
  [HierarchyLevel.Story]: TransitionStatus[];
  [HierarchyLevel.Epic]: TransitionStatus[];
};

const getDatasetStatuses = async (
  datasetId?: string,
): Promise<DatasetStatuses> => {
  const response = await axios.get(`/datasets/${datasetId}/statuses`);
  return response.data;
};

export const useDatasetStatuses = (datasetId?: string) => {
  return useQuery({
    queryKey: [issuesQueryKey, datasetId],
    queryFn: () => getDatasetStatuses(datasetId),
    enabled: datasetId !== undefined,
  });
};
