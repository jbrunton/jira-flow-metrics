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
        crumb: ({ dataSet }: NavigationContext) =>
          reportsCrumb(dataSet?.id, "scatterplot"),
      }}
    />
    <Route
      path="throughput"
      element={<ThroughputPage />}
      handle={{
        crumb: ({ dataSet }: NavigationContext) =>
          reportsCrumb(dataSet?.id, "throughput"),
      }}
    />
    <Route index element={<Navigate to="scatterplot" />} />
  </Route>
);

const reportsCrumb = (
  dataSetId: string | undefined,
  reportKey: "scatterplot" | "throughput",
): ItemType => {
  const reports = [
    {
      key: "scatterplot",
      label: <Link to={scatterplotPath({ dataSetId })}>Scatterplot</Link>,
    },
    {
      key: "throughput",
      label: <Link to={throughputPath({ dataSetId })}>Throughput</Link>,
    },
  ];
  const currentReport = reports.find((report) => report.key === reportKey);
  return {
    title: currentReport?.label,
    menu: { items: reports, selectedKeys: [reportKey] },
  };
};
