import { Link, Navigate, Route } from "react-router-dom";
import { NavigationHandle } from "../navigation/breadcrumbs";
import { issueRoutes } from "./issues/issue-routes";
import { reportRoutes } from "./reports/report-routes";
import { datasetRootPath, datasetsIndexPath } from "../navigation/paths";
import { DatasetsLayout } from "./datasets-layout";
import { DatasetProvider } from "./context/provider";

const datasetsHandle: NavigationHandle = {
  crumb({ datasetId }) {
    return {
      title: datasetId ? undefined : "Datasets",
    };
  },
  title: ({ domain }) => domain?.host,
};

const datasetHandle: NavigationHandle = {
  crumb({ dataset, datasets }) {
    if (!datasets) {
      return { title: "Loading" };
    }

    const datasetOptions = datasets?.map((dataset) => ({
      key: dataset.id,
      label: (
        <Link to={datasetRootPath({ datasetId: dataset.id })}>
          {dataset.name}
        </Link>
      ),
    }));

    const genericOptions = [
      { type: "divider" },
      {
        key: "datasets",
        label: (
          <Link to={datasetsIndexPath({ domainId: dataset?.domainId })}>
            Manage Datasets
          </Link>
        ),
      },
    ];

    const items = [...datasetOptions, ...genericOptions];

    const selectedKeys = dataset ? [dataset.id] : [];

    return { title: dataset?.name, menu: { items, selectedKeys } };
  },
};

export const datasetRoutes = (
  <Route path="datasets" handle={datasetsHandle}>
    <Route
      path=":datasetId"
      handle={datasetHandle}
      element={
        <DatasetProvider>
          <DatasetsLayout />
        </DatasetProvider>
      }
    >
      {issueRoutes}
      {reportRoutes}
      <Route index element={<Navigate to="issues" />} />
    </Route>
  </Route>
);
