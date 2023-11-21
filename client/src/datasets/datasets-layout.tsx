import { useDatasetContext } from "./context";
import { LoadingSpinner } from "../components/loading-spinner";
import { Outlet } from "react-router-dom";
import { DatasetOptionsForm } from "./reports/components/filter-form/dataset-options-form";

export const DatasetsLayout = () => {
  const { dataset, setDatasetOptions, issues } = useDatasetContext();

  if (!dataset) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <DatasetOptionsForm
        datasetId={dataset?.id}
        onOptionsChanged={setDatasetOptions}
        issuesCount={issues?.length}
      />
      <Outlet />
    </>
  );
};
