import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./client.ts";
import { ConfigProvider } from "antd";
import { DomainProvider } from "./domains/context/provider.tsx";
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
} from "chart.js";
import "chartjs-adapter-date-fns";
// TODO: do we need all of these?
ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  TimeScale,
  Tooltip,
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <DomainProvider>
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
      </DomainProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
