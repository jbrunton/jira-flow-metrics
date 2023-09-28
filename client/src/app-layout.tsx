import { Outlet } from "react-router-dom";
import { Breadcrumbs } from "./navigation/breadcrumbs";
import { Col, Layout, Row } from "antd";

export const AppLayout = () => (
  <Layout>
    <Layout.Header>
      <Row>
        <Col flex="auto">
          <Breadcrumbs />
        </Col>
      </Row>
    </Layout.Header>
    <Layout.Content style={{ margin: "0 50px" }}>
      <Outlet />
    </Layout.Content>
  </Layout>
);
