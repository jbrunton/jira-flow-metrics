import { Dataset } from "@data/datasets";
import { Issue } from "@jbrunton/flow-metrics";
import { DatasetOptions } from "./components/filter-form/dataset-options-form";

export type ReportsContext = {
  issues: Issue[];
  dataset: Dataset;
  datasetOptions?: DatasetOptions;
};
