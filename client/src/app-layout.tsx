import { Outlet } from "react-router-dom";
import { Breadcrumbs } from "./navigation/breadcrumbs";
import { Col, Layout, Row, Typography } from "antd";
import { Title } from "./navigation/title";
import { useNavigationContext } from "./navigation/context";
import { formatDate } from "./lib/format";

const FooterContent = () => {
  const { dataset } = useNavigationContext();
  if (dataset) {
    return (
      <Typography.Text type="secondary">
        {dataset.name} last synced:{" "}
        {formatDate(dataset.lastSync?.date) ?? "never"}
      </Typography.Text>
    );
  }
};

export const AppLayout = () => (
  <Layout style={{ maxWidth: "1440px", margin: "auto" }}>
    <Layout.Header>
      <Row>
        <Col flex="auto">
          <Breadcrumbs />
        </Col>
      </Row>
    </Layout.Header>
    <Layout.Content style={{ margin: "0 50px" }}>
      <Title />
      <Outlet />
    </Layout.Content>
    <Layout.Footer style={{ textAlign: "center" }}>
      <FooterContent />
    </Layout.Footer>
  </Layout>
);
