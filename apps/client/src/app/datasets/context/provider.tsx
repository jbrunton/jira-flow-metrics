import { useState } from "react";
import { useNavigationContext } from "../../navigation/context";
import { DatasetContext, DatasetContextType } from "./context";
import { DatasetOptions } from "../reports/components/filter-form/dataset-options-form";
import { useIssues } from "@data/issues";

export const DatasetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { dataset } = useNavigationContext();
  const [datasetOptions, setDatasetOptions] = useState<DatasetOptions>();

  const { data: issues } = useIssues(
    dataset?.id,
    datasetOptions?.includeWaitTime ?? false,
    datasetOptions?.statuses,
  );

  const value: DatasetContextType = {
    dataset,
    issues,
    datasetOptions,
    setDatasetOptions,
  };

  return (
    <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>
  );
};
