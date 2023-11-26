import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./client.ts";
import { ConfigProvider } from "antd";
import App from "./app.tsx";
import { FilterProvider } from "./filter/context/provider.tsx";

import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Title,
  BarController,
  BarElement,
} from "chart.js";
import "chartjs-adapter-date-fns";
import annotationPlugin from "chartjs-plugin-annotation";
// TODO: do we need all of these?
ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  BarController,
  BarElement,
  Title,
  TimeScale,
  Tooltip,
  annotationPlugin,
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <FilterProvider>
        <ConfigProvider
          theme={{
            components: {
              Layout: {
                headerBg: "#FFF",
                bodyBg: "#FFF",
              },
            },
          }}
        >
          <App />
        </ConfigProvider>
      </FilterProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
