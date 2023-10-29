import { Link, Navigate, Route } from "react-router-dom";
import { ScatterplotPage } from "./scatterplot/scatterplot-page";
import { NavigationContext } from "../../navigation/context";
import { ThroughputPage } from "./throughput/throughput-page";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import {
  forecastPath,
  scatterplotPath,
  throughputPath,
  wipPath,
} from "../../navigation/paths";
import { WipPage } from "./wip/wip-page";
import { ForecastPage } from "./forecast/forecast-page";

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
      path="wip"
      element={<WipPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "wip"),
      }}
    />
    <Route
      path="forecast"
      element={<ForecastPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "forecast"),
      }}
    />
    <Route index element={<Navigate to="scatterplot" />} />
  </Route>
);

const reportsCrumb = (
  datasetId: string | undefined,
  reportKey: "scatterplot" | "throughput" | "wip" | "forecast",
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
          key: "wip",
          label: <Link to={wipPath({ datasetId })}>WIP</Link>,
        },
        {
          key: "forecast",
          label: <Link to={forecastPath({ datasetId })}>Forecast</Link>,
        },
      ]
    : [];
  const currentReport = reports.find((report) => report.key === reportKey);
  return {
    title: currentReport?.label,
    menu: { items: reports, selectedKeys: [reportKey] },
  };
};
