import { Route } from "react-router-dom";
import { DomainsIndexPage } from "./domains-index-page";
import { DatasetsIndexPage } from "../datasets/index/datasets-index-page";
import { NavigationContext } from "../navigation/context";

export const domainRoutes = (
  <Route path="domains">
    <Route
      index
      element={<DomainsIndexPage />}
      handle={{ title: "Jira domains" }}
    />
    <Route
      path=":domainId/datasets"
      element={<DatasetsIndexPage />}
      index
      handle={{
        title: ({ domain }: NavigationContext) => ["Datasets", domain?.host],
      }}
    />
  </Route>
);
