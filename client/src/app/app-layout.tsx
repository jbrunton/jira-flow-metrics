import { Outlet } from "react-router-dom";
import { Breadcrumbs } from "./navigation/breadcrumbs";
import { Button, Col, Layout, Row, Space, Typography } from "antd";
import { Title } from "./navigation/title";
import { useNavigationContext } from "./navigation/context";
import { formatDate } from "@lib/format";
import { useSyncDataset } from "@data/datasets";

const FooterContent = () => {
  const { dataset } = useNavigationContext();
  const syncDataset = useSyncDataset();

  if (dataset) {
    return (
      <Space>
        <Typography.Text type="secondary">{dataset.name}</Typography.Text>
        &middot;
        <Typography.Text type="secondary">
          last synced: {formatDate(dataset.lastSync?.date) ?? "never"}
        </Typography.Text>
        &middot;
        <Button
          type="dashed"
          size="small"
          disabled={syncDataset.isLoading}
          loading={syncDataset.isLoading}
          onClick={() => syncDataset.mutate(dataset?.id)}
        >
          Sync
        </Button>
      </Space>
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
