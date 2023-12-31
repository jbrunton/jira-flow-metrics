import { Navigate, Route } from "react-router-dom";
import { ScatterplotPage } from "./scatterplot/scatterplot-page";
import { NavigationContext } from "../../navigation/context";
import { ThroughputPage } from "./throughput/throughput-page";
import { WipPage } from "./wip/wip-page";
import { ForecastPage } from "./forecast/forecast-page";
import { reportsCrumb } from "../components/reports-crumb";
import { TimeSpentPage } from "./time-spent/time-spent-page";

export const reportRoutes = (
  <Route path="reports">
    <Route
      path="scatterplot"
      element={<ScatterplotPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "scatterplot"),
        title: ({ dataset }: NavigationContext) => [
          "Scatterplot",
          dataset?.name,
        ],
      }}
    />
    <Route
      path="throughput"
      element={<ThroughputPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "throughput"),
        title: ({ dataset }: NavigationContext) => [
          "Throughput",
          dataset?.name,
        ],
      }}
    />
    <Route
      path="wip"
      element={<WipPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "wip"),
        title: ({ dataset }: NavigationContext) => ["WIP", dataset?.name],
      }}
    />
    <Route
      path="forecast"
      element={<ForecastPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "forecast"),
        title: ({ dataset }: NavigationContext) => ["Forecast", dataset?.name],
      }}
    />
    <Route
      path="time-spent"
      element={<TimeSpentPage />}
      handle={{
        crumb: ({ dataset }: NavigationContext) =>
          reportsCrumb(dataset?.id, "time-spent"),
        title: ({ dataset }: NavigationContext) => [
          "Time Spent",
          dataset?.name,
        ],
      }}
    />
    <Route index element={<Navigate to="scatterplot" />} />
  </Route>
);
