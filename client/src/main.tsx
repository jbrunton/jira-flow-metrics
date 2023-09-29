import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./client.ts";
import { ConfigProvider } from "antd";
import { DomainProvider } from "./domains/context/provider.tsx";
import App from "./app.tsx";
import { FilterProvider } from "./filter/context/provider.tsx";

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
