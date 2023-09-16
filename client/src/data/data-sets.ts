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

const getDataSources = async (query: string): Promise<DataSource[]> => {
  if (query.trim().length === 0) {
    return [];
  }

  const response = await axios.get(`http://localhost:3000/api/datasets/sources?query=${encodeURI(query)}`);
  return response.data;
}

export const useDataSources = (query: string) => {
  return useQuery({
    queryKey: ['datasources', query],
    queryFn: () => getDataSources(query),
  });
}

const getDataSets = async (): Promise<DataSet[]> => {
  const response = await axios.get(`http://localhost:3000/api/datasets`);
  return response.data;
}

export const useDataSets = () => {
  return useQuery({
    queryKey: ['datasets'],
    queryFn: getDataSets,
  });
}

const createDataSet = async (dataSet: Omit<DataSet, "id">): Promise<DataSet> => {
  const response = await axios.post('http://localhost:3000/api/datasets', dataSet);
  return response.data;
}

export const useCreateDataSet = () => {
  return useMutation({
    mutationFn: createDataSet,
    onSuccess: () => client.invalidateQueries(['datasets'])
  });
}
