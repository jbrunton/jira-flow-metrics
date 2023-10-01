import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { client } from "../client";

export type DataSource = {
  name: string;
  jql: string;
  type: "project" | "filter";
};

export type DataSet = {
  id: string;
  name: string;
  jql: string;
};

const datasetsQueryKey = "datasets";

export const invalidateDataSourceQueries = () =>
  client.invalidateQueries([datasetsQueryKey]);

const getDataSources = async (query: string): Promise<DataSource[]> => {
  if (query.trim().length === 0) {
    return [];
  }

  const response = await axios.get(
    `/datasets/sources?query=${encodeURI(query)}`,
  );
  return response.data;
};

export const useDataSources = (query: string) => {
  return useQuery({
    queryKey: [datasetsQueryKey, query],
    queryFn: () => getDataSources(query),
  });
};

const getDataSets = async (): Promise<DataSet[]> => {
  const response = await axios.get(`/datasets`);
  return response.data;
};

export const useDataSets = () => {
  return useQuery({
    queryKey: [datasetsQueryKey],
    queryFn: () => getDataSets(),
  });
};

const syncDataSet = async (datasetId: string): Promise<void> => {
  await axios.put(`/datasets/${datasetId}/sync`);
};

export const useSyncDataSet = () => {
  return useMutation({
    mutationFn: syncDataSet,
    onSuccess: () => client.invalidateQueries(["issues"]),
  });
};

const removeDataSet = async (datasetId: string): Promise<void> => {
  await axios.delete(`/datasets/${datasetId}`);
};

export const useRemoveDataSet = (datasetId?: string) => {
  return useMutation({
    mutationFn: () => removeDataSet(datasetId ?? ""),
    onSuccess: () => {
      client.invalidateQueries(["issues"]);
      client.invalidateQueries([datasetsQueryKey]);
    },
  });
};

export type CreateDataSetParams = Omit<DataSet, "id"> & {
  domainId: string;
};

const createDataSet = async (
  dataset: CreateDataSetParams,
): Promise<DataSet> => {
  const response = await axios.post(`/datasets`, dataset);
  return response.data;
};

export const useCreateDataSet = () => {
  return useMutation({
    mutationFn: createDataSet,
    onSuccess: () => client.invalidateQueries([datasetsQueryKey]),
  });
};
