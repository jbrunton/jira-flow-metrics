import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getGreeting = async (): Promise<string> => {
  const response = await axios.get("http://localhost:3000/api");
  return response.data;
};

export const useGreeting = () => {
  return useQuery({ queryKey: ["greeting"], queryFn: getGreeting });
};
