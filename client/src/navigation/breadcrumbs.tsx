import { Breadcrumb } from "antd";
import { RouteObject, useMatches } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { NavigationContext, useNavigationContext } from "./context";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";

export interface NavigationHandle {
  crumb?: (context: NavigationContext) => ItemType | undefined;
  title?: (context: NavigationContext) => string | undefined;
}

export const Breadcrumbs = () => {
  const matches: RouteObject[] = useMatches();
  const navigationContext = useNavigationContext();

  const crumbs = matches
    .filter((match) => match.handle?.crumb)
    .map((match) => match.handle.crumb(navigationContext))
    .filter((crumb) => crumb !== undefined);

  crumbs.unshift({ title: "Jira Flow Metrics" });

  return (
    <Breadcrumb
      separator={<RightOutlined />}
      style={{ margin: "16px 0" }}
      items={crumbs}
    />
  );
};
