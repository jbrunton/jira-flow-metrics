import { Link, Navigate, Route } from "react-router-dom";
import { ScatterplotPage } from "./scatterplot/scatterplot-page";
import { NavigationContext } from "../../navigation/context";
import { ThroughputPage } from "./throughput/throughput-page";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import {
  scatterplotPath,
  throughputHistogramPath,
  throughputPath,
  wipPath,
} from "../../navigation/paths";
import { WipPage } from "./wip/wip-page";
import { ThroughputHistogramPage } from "./throughput-histogram/throughput-histogram-page";

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
    <Route
      path="throughput-histogram"
      element={<ThroughputHistogramPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "throughput-histogram"),
      }}
    />
    <Route
      path="wip"
      element={<WipPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "wip"),
      }}
    />
    <Route index element={<Navigate to="scatterplot" />} />
  </Route>
);

const reportsCrumb = (
  datasetId: string | undefined,
  reportKey: "scatterplot" | "throughput" | "throughput-histogram" | "wip",
): ItemType => {
  const reports = datasetId
    ? [
        {
          key: "scatterplot",
          label: <Link to={scatterplotPath({ datasetId })}>Scatterplot</Link>,
        },
        {
          key: "throughput",
          label: <Link to={throughputPath({ datasetId })}>Throughput</Link>,
        },
        {
          key: "throughput-histogram",
          label: (
            <Link to={throughputHistogramPath({ datasetId })}>
              Throughput Histogram
            </Link>
          ),
        },
        {
          key: "wip",
          label: <Link to={wipPath({ datasetId })}>WIP</Link>,
        },
      ]
    : [];
  const currentReport = reports.find((report) => report.key === reportKey);
  return {
    title: currentReport?.label,
    menu: { items: reports, selectedKeys: [reportKey] },
  };
};
