import { Breadcrumb, Space } from "antd";
import { RouteObject, useMatches } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { NavigationContext, useNavigationContext } from "./context";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import Icon from "@ant-design/icons/lib/components/Icon";

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

  crumbs.unshift({
    title: (
      <Space align="center">
        <Icon
          style={{ opacity: crumbs.length >= 1 ? 0.7 : 1 }}
          component={() => <img src="/icon.png" />}
        />
        Jira Flow Metrics
      </Space>
    ),
  });

  return (
    <Breadcrumb
      separator={<RightOutlined />}
      style={{ margin: "16px 0" }}
      items={crumbs}
    />
  );
};
