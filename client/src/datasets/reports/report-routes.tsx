import { Link, Navigate, Route } from "react-router-dom";
import { ScatterplotPage } from "./scatterplot/scatterplot-page";
import { NavigationContext } from "../../navigation/context";
import { ThroughputPage } from "./throughput/throughput-page";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import {
  forecastPath,
  issuesIndexPath,
  scatterplotPath,
  throughputPath,
  wipPath,
} from "../../navigation/paths";
import { WipPage } from "./wip/wip-page";
import { ForecastPage } from "./forecast/forecast-page";

export const reportRoutes = (
  <Route path="reports">
    <Route
      path="scatterplot"
      element={<ScatterplotPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "scatterplot"),
        title: ({ dataset }: NavigationContext) =>
          `${dataset?.name} Scatterplot`,
      }}
    />
    <Route
      path="throughput"
      element={<ThroughputPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "throughput"),
        title: ({ dataset }: NavigationContext) =>
          `${dataset?.name} Throughput`,
      }}
    />
    <Route
      path="wip"
      element={<WipPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "wip"),
        title: ({ dataset }: NavigationContext) =>
          `${dataset?.name} Throughput`,
      }}
    />
    <Route
      path="forecast"
      element={<ForecastPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "forecast"),
        title: ({ dataset }: NavigationContext) => `${dataset?.name} Forecast`,
      }}
    />
    <Route index element={<Navigate to="scatterplot" />} />
  </Route>
);

const reportsCrumb = (
  datasetId: string | undefined,
  reportKey: "scatterplot" | "throughput" | "wip" | "forecast",
): ItemType => {
  const reportOptions = datasetId
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
          key: "wip",
          label: <Link to={wipPath({ datasetId })}>WIP</Link>,
        },
        {
          key: "forecast",
          label: <Link to={forecastPath({ datasetId })}>Forecast</Link>,
        },
      ]
    : [];
  const currentReport = reportOptions.find(
    (report) => report.key === reportKey,
  );
  const issueOptions = datasetId
    ? [
        { type: "divider" },
        {
          key: "issues",
          label: <Link to={issuesIndexPath({ datasetId })}>Issues</Link>,
        },
      ]
    : [];
  const items = [...reportOptions, ...issueOptions];
  return {
    title: currentReport?.label,
    menu: { items, selectedKeys: [reportKey] },
  };
};
