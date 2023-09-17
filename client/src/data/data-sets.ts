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

const getDataSources = async (domainId: string | undefined, query: string): Promise<DataSource[]> => {
  if (query.trim().length === 0) {
    return [];
  }

  const response = await axios.get(`http://localhost:3000/api/datasets/${domainId}/sources?query=${encodeURI(query)}`);
  return response.data;
}

export const useDataSources = (domainId: string | undefined, query: string) => {
  return useQuery({
    queryKey: ['datasources', domainId, query],
    queryFn: () => getDataSources(domainId, query),
    enabled: domainId !== undefined,
  });
}

const getDataSets = async (domainId?: string): Promise<DataSet[]> => {
  const response = await axios.get(`http://localhost:3000/api/datasets/${domainId}`);
  return response.data;
}

export const useDataSets = (domainId?: string) => {
  return useQuery({
    queryKey: ['datasets', domainId],
    queryFn: () => getDataSets(domainId),
    enabled: domainId !== undefined,
  });
}

export type CreateDataSetParams = Omit<DataSet, "id"> & {
  domainId: string;
}

const createDataSet = async ({ domainId, ...dataSet }: CreateDataSetParams): Promise<DataSet> => {
  const response = await axios.post(`http://localhost:3000/api/datasets/${domainId}`, dataSet);
  return response.data;
}

export const useCreateDataSet = () => {
  return useMutation({
    mutationFn: createDataSet,
    onSuccess: () => client.invalidateQueries(['datasets'])
  });
}
