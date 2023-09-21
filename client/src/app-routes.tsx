import { Link, Navigate, Route } from "react-router-dom";
import { BreadcrumbHandle } from "./navigation/breadcrumbs";
import { domainRoutes } from "./domains/domain-routes";
import { dataSetRoutes } from "./data-sets/data-sets-routes";
import { AppLayout } from "./app-layout";

const rootHandle: BreadcrumbHandle = {
  crumb({ domain, domains, path, setDomainId }) {
    if (path === "/domains") {
      return;
    }

    if (!domains) {
      return { title: 'Loading' };
    }

    if (path !== "/domains" && domain) {
      const domainOptions = domains.map((domain) => ({
        key: domain.id,
        label: <span onClick={() => setDomainId(domain.id)}>{domain.host}</span>,
      }));

      const genericOptions = [
        { type: 'divider' },
        { key: 'domains', label: <Link to="/domains">Manage Domains</Link> }
      ];

      return { title: domain.host, menu: { items: [...domainOptions, ...genericOptions] } };
    }      
  }
}

export const appRoutes = (
  <Route
    path="/"
    element={<AppLayout />}
    handle={rootHandle}
  >
    <Route index element={<Navigate to="/domains" />} />
    {domainRoutes}
    {dataSetRoutes}
  </Route>
);
