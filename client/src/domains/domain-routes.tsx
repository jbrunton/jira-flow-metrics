import { Route } from "react-router-dom";
import { NavigationHandle } from "../navigation/breadcrumbs";
import { DomainsIndexPage } from "./domains-index-page";

const domainsHandle: NavigationHandle = {
  crumb: () => ({ title: "Domains" }),
};

export const domainRoutes = (
  <Route
    path="/domains"
    element={<DomainsIndexPage />}
    handle={domainsHandle}
  />
);
