import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { client } from "../client";

export type Domain = {
  id: string;
  host: string;
  email: string;
  token: string;
}

const domainsQueryKey = 'domains';

const getDomains = async (): Promise<Domain[]> => {
  const response = await axios.get('/domains');
  return response.data;
}

export const useDomains = () => {
  return useQuery({ queryKey: [domainsQueryKey], queryFn: getDomains });
}

const createDomain = async (domain: Omit<Domain, "id">): Promise<Domain> => {
  const response = await axios.post('/domains', domain);
  return response.data;
}

export const useCreateDomain = () => {
  return useMutation({
    mutationFn: createDomain,
    onSuccess: () => client.invalidateQueries([domainsQueryKey])
  });
}
