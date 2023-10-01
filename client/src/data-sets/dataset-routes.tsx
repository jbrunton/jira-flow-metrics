import { Link, Route } from "react-router-dom";
import { BreadcrumbHandle } from "../navigation/breadcrumbs";
import { DataSetsIndexPage } from "./index/datasets-index-page";
import { issueRoutes } from "./issues/issue-routes";
import { reportRoutes } from "./reports/report-routes";
import { datasetRootPath } from "../navigation/paths";

const dataSetsHandle: BreadcrumbHandle = {
  crumb({ dataSetId }) {
    return {
      title: dataSetId ? <Link to="/datasets">Datasets</Link> : "Datasets",
    };
  },
};

const dataSetHandle: BreadcrumbHandle = {
  crumb({ dataset, dataSets }) {
    if (!dataSets) {
      return { title: "Loading" };
    }

    const items = dataSets?.map((dataset) => ({
      key: dataset.id,
      label: (
        <Link to={datasetRootPath({ dataSetId: dataset.id })}>
          {dataset.name}
        </Link>
      ),
    }));

    const selectedKeys = dataset ? [dataset.id] : [];

    return { title: dataset?.name, menu: { items, selectedKeys } };
  },
};

export const dataSetRoutes = (
  <Route path="datasets" handle={dataSetsHandle}>
    <Route index element={<DataSetsIndexPage />} />
    <Route path=":dataSetId" handle={dataSetHandle}>
      {issueRoutes}
      {reportRoutes}
    </Route>
  </Route>
);
