import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { client } from "../client";

export type Domain = {
  id: string;
  host: string;
  email: string;
  token: string;
}

const getDomains = async (): Promise<Domain[]> => {
  const response = await axios.get('http://localhost:3000/api/domains');
  return response.data;
}

export const useDomains = () => {
  return useQuery({ queryKey: ['domains'], queryFn: getDomains });
}

const createDomain = async (domain: Omit<Domain, "id">): Promise<Domain> => {
  const response = await axios.post('http://localhost:3000/api/domains', domain);
  return response.data;
}

export const useCreateDomain = () => {
  return useMutation({
    mutationFn: createDomain,
    onSuccess: () => client.invalidateQueries(['domains'])
  });
}
