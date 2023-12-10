import { Dataset } from "@data/datasets";
import { Issue } from "@entities/issues";
import { DatasetOptions } from "./components/filter-form/dataset-options-form";

export type ReportsContext = {
  issues: Issue[];
  dataset: Dataset;
  datasetOptions?: DatasetOptions;
};
