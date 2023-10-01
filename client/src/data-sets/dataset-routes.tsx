import { Link, Route } from "react-router-dom";
import { BreadcrumbHandle } from "../navigation/breadcrumbs";
import { DatasetsIndexPage } from "./index/datasets-index-page";
import { issueRoutes } from "./issues/issue-routes";
import { reportRoutes } from "./reports/report-routes";
import { datasetRootPath } from "../navigation/paths";

const datasetsHandle: BreadcrumbHandle = {
  crumb({ datasetId }) {
    return {
      title: datasetId ? <Link to="/datasets">Datasets</Link> : "Datasets",
    };
  },
};

const datasetHandle: BreadcrumbHandle = {
  crumb({ dataset, datasets }) {
    if (!datasets) {
      return { title: "Loading" };
    }

    const items = datasets?.map((dataset) => ({
      key: dataset.id,
      label: (
        <Link to={datasetRootPath({ datasetId: dataset.id })}>
          {dataset.name}
        </Link>
      ),
    }));

    const selectedKeys = dataset ? [dataset.id] : [];

    return { title: dataset?.name, menu: { items, selectedKeys } };
  },
};

export const datasetRoutes = (
  <Route path="datasets" handle={datasetsHandle}>
    <Route index element={<DatasetsIndexPage />} />
    <Route path=":datasetId" handle={datasetHandle}>
      {issueRoutes}
      {reportRoutes}
    </Route>
  </Route>
);
