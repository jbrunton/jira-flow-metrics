import { createContext } from "react";
import { Dataset } from "@data/datasets";
import { Issue } from "@entities/issues";
import { DatasetOptions } from "../reports/components/filter-form/dataset-options-form";

export type DatasetContextType = {
  dataset?: Dataset;
  datasetOptions?: DatasetOptions;
  setDatasetOptions: (options: DatasetOptions) => void;
  issues?: Issue[];
};

export const DatasetContext = createContext<DatasetContextType>({
  setDatasetOptions: () => {},
});
