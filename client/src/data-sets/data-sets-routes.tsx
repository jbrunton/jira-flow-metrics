import { Link, Navigate, Route } from "react-router-dom";
import { BreadcrumbHandle } from "../navigation/breadcrumbs"
import { DataSetsIndexPage } from "./index/data-sets-index-page";
import { IssuesIndexPage } from "./issues-index-page";
import { ScatterplotPage } from "./metrics/scatterplot-page";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { NavigationContext } from "../navigation/context";
import { ThroughputPage } from "./metrics/throughput-page";

const dataSetsHandle: BreadcrumbHandle = {
  crumb({ dataSet }) {
    if (dataSet) {
      return { title: <Link to="/datasets">Data Sets</Link> };         
    } else {
      return { title: 'Data Sets' };
    }
  }
};

const dataSetHandle: BreadcrumbHandle = {
  crumb({ dataSet, dataSets }) {
    if (!dataSets) {
      return { title: 'Loading' };
    }

    const items = dataSets?.map(dataSet => ({
      key: dataSet.id,
      label: <Link to={`/datasets/${dataSet.id}`}>{dataSet.name}</Link>
    }));
    
    const selectedKeys = dataSet ? [dataSet.id] : [];
    
    return { title: dataSet?.name, menu: { items, selectedKeys } };
  },
}

export const dataSetRoutes = (
  <Route
    path="/datasets"
    handle={dataSetsHandle}
  >
    <Route index element={<DataSetsIndexPage />} />
    <Route
      path=":dataSetId"
      handle={dataSetHandle}
    >
      <Route
        path="issues"
        element={<IssuesIndexPage />}
        handle={{
          crumb: ({ dataSet }: NavigationContext) => reportsCrumb(dataSet?.id, "issues")
        }} />
      <Route
        path="scatterplot"
        element={<ScatterplotPage />}
        handle={{
          crumb: ({ dataSet }: NavigationContext) => reportsCrumb(dataSet?.id, "scatterplot")
        }} />
      <Route
        path="throughput"
        element={<ThroughputPage />}
        handle={{
          crumb: ({ dataSet }: NavigationContext) => reportsCrumb(dataSet?.id, "throughput")
        }} />
      <Route index element={<Navigate to="scatterplot" />} />
    </Route>
  </Route>
);

const reportsCrumb = (datasetId: string | undefined, reportKey: "issues" | "scatterplot" | "throughput"): ItemType => {
  const reports = [
    { key: 'issues', label: <Link to={`/datasets/${datasetId}/issues`}>Issues</Link> },
    { key: 'scatterplot', label: <Link to={`/datasets/${datasetId}/scatterplot`}>Scatterplot</Link> },
    { key: 'throughput', label: <Link to={`/datasets/${datasetId}/throughput`}>Throughput</Link> },
  ];
  const currentReport = reports.find(report => report.key === reportKey);
  return {
    title: currentReport?.label,
    menu: { items: reports, selectedKeys: [reportKey] },
  };
}
