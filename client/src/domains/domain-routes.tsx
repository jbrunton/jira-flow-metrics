import { Route } from "react-router-dom";
import { BreadcrumbHandle } from "../navigation/breadcrumbs";
import { DomainsPage } from "./domains-page";

const domainsHandle: BreadcrumbHandle = {
  crumb: () => ({ title: "Domains" }),
};

export const domainRoutes = (
  <Route path="/domains" element={<DomainsPage />} handle={domainsHandle} />
);
