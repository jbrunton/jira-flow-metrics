import { Link, Navigate, Route } from "react-router-dom";
import { ScatterplotPage } from "./scatterplot/scatterplot-page";
import { NavigationContext } from "../../navigation/context";
import { ThroughputPage } from "./throughput/throughput-page";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { scatterplotPath, throughputPath } from "../../navigation/paths";

export const reportRoutes = (
  <Route path="reports" handle={{ crumb: () => ({ title: "Reports" }) }}>
    <Route
      path="scatterplot"
      element={<ScatterplotPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "scatterplot"),
      }}
    />
    <Route
      path="throughput"
      element={<ThroughputPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "throughput"),
      }}
    />
    <Route index element={<Navigate to="scatterplot" />} />
  </Route>
);

const reportsCrumb = (
  datasetId: string | undefined,
  reportKey: "scatterplot" | "throughput",
): ItemType => {
  const reports = [
    {
      key: "scatterplot",
      label: <Link to={scatterplotPath({ datasetId })}>Scatterplot</Link>,
    },
    {
      key: "throughput",
      label: <Link to={throughputPath({ datasetId })}>Throughput</Link>,
    },
  ];
  const currentReport = reports.find((report) => report.key === reportKey);
  return {
    title: currentReport?.label,
    menu: { items: reports, selectedKeys: [reportKey] },
  };
};