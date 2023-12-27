import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  HierarchyLevel,
  Issue,
  IssueFlowMetrics,
} from "@jbrunton/flow-metrics";

const issuesQueryKey = "issues";

const getIssues = async (
  datasetId: string | undefined,
  includeWaitTime: boolean,
  fromStatus?: string,
  toStatus?: string,
): Promise<Issue[]> => {
  let url = `/datasets/${datasetId}/issues?includeWaitTime=${includeWaitTime}`;
  if (fromStatus && toStatus) {
    url += `&fromStatus=${fromStatus}&toStatus=${toStatus}`;
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
  fromStatus?: string,
  toStatus?: string,
) => {
  return useQuery({
    queryKey: [
      issuesQueryKey,
      datasetId,
      includeWaitTime,
      fromStatus,
      toStatus,
    ],
    queryFn: () => getIssues(datasetId, includeWaitTime, fromStatus, toStatus),
    enabled: datasetId !== undefined && includeWaitTime !== undefined,
  });
};

export type DatasetStatuses = {
  [HierarchyLevel.Story]: string[];
  [HierarchyLevel.Epic]: string[];
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
