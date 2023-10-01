import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { client } from "../client";

export type DataSource = {
  name: string;
  jql: string;
  type: "project" | "filter";
};

export type Dataset = {
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

const getDatasets = async (): Promise<Dataset[]> => {
  const response = await axios.get(`/datasets`);
  return response.data;
};

export const useDatasets = () => {
  return useQuery({
    queryKey: [datasetsQueryKey],
    queryFn: () => getDatasets(),
  });
};

const syncDataset = async (datasetId: string): Promise<void> => {
  await axios.put(`/datasets/${datasetId}/sync`);
};

export const useSyncDataset = () => {
  return useMutation({
    mutationFn: syncDataset,
    onSuccess: () => client.invalidateQueries(["issues"]),
  });
};

const removeDataset = async (datasetId: string): Promise<void> => {
  await axios.delete(`/datasets/${datasetId}`);
};

export const useRemoveDataset = (datasetId?: string) => {
  return useMutation({
    mutationFn: () => removeDataset(datasetId ?? ""),
    onSuccess: () => {
      client.invalidateQueries(["issues"]);
      client.invalidateQueries([datasetsQueryKey]);
    },
  });
};

export type CreateDatasetParams = Omit<Dataset, "id"> & {
  domainId: string;
};

const createDataset = async (
  dataset: CreateDatasetParams,
): Promise<Dataset> => {
  const response = await axios.post(`/datasets`, dataset);
  return response.data;
};

export const useCreateDataset = () => {
  return useMutation({
    mutationFn: createDataset,
    onSuccess: () => client.invalidateQueries([datasetsQueryKey]),
  });
};
