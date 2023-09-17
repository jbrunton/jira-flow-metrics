import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { client } from "../client";

export type DataSource = {
  name: string;
  jql: string;
  type: "project" | "filter";
}

export type DataSet = {
  id: string;
  name: string;
  jql: string;
}

const dataSetsQueryKey = 'datasets';

export const invalidateDataSourceQueries = () => client.invalidateQueries([dataSetsQueryKey]);

const getDataSources = async (query: string): Promise<DataSource[]> => {
  if (query.trim().length === 0) {
    return [];
  }

  const response = await axios.get(`/datasets/sources?query=${encodeURI(query)}`);
  return response.data;
}

export const useDataSources = (query: string) => {
  return useQuery({
    queryKey: [dataSetsQueryKey, query],
    queryFn: () => getDataSources(query),
  });
}

const getDataSets = async (): Promise<DataSet[]> => {
  const response = await axios.get(`/datasets`);
  return response.data;
}

export const useDataSets = () => {
  return useQuery({
    queryKey: [dataSetsQueryKey],
    queryFn: () => getDataSets(),
  });
}

const syncDataSet = async (dataSetId: string): Promise<void> => {
  await axios.put(`/issues/${dataSetId}/sync`);
}

export const useSyncDataSet = () => {
  return useMutation({
    mutationFn: syncDataSet,
    onSuccess: () => client.invalidateQueries(['issues'])
  })
}

export type CreateDataSetParams = Omit<DataSet, "id"> & {
  domainId: string;
}

const createDataSet = async (dataSet: CreateDataSetParams): Promise<DataSet> => {
  const response = await axios.post(`/datasets`, dataSet);
  return response.data;
}

export const useCreateDataSet = () => {
  return useMutation({
    mutationFn: createDataSet,
    onSuccess: () => client.invalidateQueries([dataSetsQueryKey])
  });
}
