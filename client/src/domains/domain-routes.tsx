import { Route } from "react-router-dom";
import { DomainsIndexPage } from "./domains-index-page";
import { DatasetsIndexPage } from "../datasets/index/datasets-index-page";

export const domainRoutes = (
  <Route path="domains">
    <Route index element={<DomainsIndexPage />} />
    <Route path=":domainId/datasets" element={<DatasetsIndexPage />} index />
  </Route>
);
