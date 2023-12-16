import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./data/client.ts";
import { ConfigProvider } from "antd";
import App from "./app/app.tsx";
import { FilterProvider } from "./app/filter/context/provider.tsx";
import "./main.css";

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
  CategoryScale,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import annotationPlugin from "chartjs-plugin-annotation";
import datalabelsPlugin from "chartjs-plugin-datalabels";
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
  CategoryScale,
  Legend,
  datalabelsPlugin,
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
                footerBg: "#FFF",
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
