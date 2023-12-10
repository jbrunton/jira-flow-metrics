import { useContext } from "react";
import { DatasetContext, DatasetContextType } from "./context";

export const useDatasetContext = (): DatasetContextType => {
  return useContext(DatasetContext);
};
