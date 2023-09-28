import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./client.ts";
import { ConfigProvider } from "antd";
import { DomainProvider } from "./domains/context/provider.tsx";
import App from "./app.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <DomainProvider>
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
      </DomainProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
