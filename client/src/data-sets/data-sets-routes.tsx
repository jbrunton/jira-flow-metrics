import { Link, Route } from "react-router-dom";
import { BreadcrumbHandle } from "../navigation/breadcrumbs";
import { DataSetsIndexPage } from "./index/data-sets-index-page";
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
  crumb({ dataSet, dataSets }) {
    if (!dataSets) {
      return { title: "Loading" };
    }

    const items = dataSets?.map((dataSet) => ({
      key: dataSet.id,
      label: (
        <Link to={datasetRootPath({ dataSetId: dataSet.id })}>
          {dataSet.name}
        </Link>
      ),
    }));

    const selectedKeys = dataSet ? [dataSet.id] : [];

    return { title: dataSet?.name, menu: { items, selectedKeys } };
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
