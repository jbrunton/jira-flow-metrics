import { Link, Route } from "react-router-dom";
import { BreadcrumbHandle } from "../navigation/breadcrumbs"
import { DataSetsIndexPage } from "./data-sets-index-page";
import { NavigationContext } from "../navigation/context";
import { IssuesIndexPage } from "./issues-index-page";
import { MetricsPage } from "../metrics/metrics-page";

const dataSetsHandle: BreadcrumbHandle = {
  crumb({ dataSet }) {
    if (dataSet) {
      return { title: <Link to="/datasets">Data Sets</Link> };         
    } else {
      return { title: 'Data Sets' };
    }
  }
};

export const dataSetRoutes = [
  <Route
    path="/datasets"
    handle={dataSetsHandle}
  >
    <Route index element={<DataSetsIndexPage />} />
    <Route
      path=":dataSetId"
      handle={{ crumb: ({ dataSet }: NavigationContext) => ({ title: dataSet?.name })}}
    >
      <Route
        path="issues"
        element={<IssuesIndexPage />}
        handle={{
          crumb: () => ({ title: 'Issues' })
        }} />
      <Route
        path="metrics"
        element={<MetricsPage />}
        handle={{
          crumb: () => ({ title: 'Metrics' })
        }} />
    </Route>
  </Route>
]
