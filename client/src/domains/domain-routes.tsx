import { Route } from "react-router-dom";
import { BreadcrumbHandle } from "../navigation/breadcrumbs";
import { DomainsIndexPage } from "./domains-index-page";

const domainsHandle: BreadcrumbHandle = {
  crumb: () => ({ title: "Domains" }),
};

export const domainRoutes = (
  <Route
    path="/domains"
    element={<DomainsIndexPage />}
    handle={domainsHandle}
  />
);
