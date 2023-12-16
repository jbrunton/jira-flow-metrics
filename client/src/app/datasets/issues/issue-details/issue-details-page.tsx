import { Button, Col, Drawer, Layout, Row, Space } from "antd";
import { IssuesTable } from "../../../components/issues-table";
import { HierarchyLevel } from "@entities/issues";
import { useNavigationContext } from "../../../navigation/context";
import { IssueDetailsCard } from "../components/issue-details-card";
import { IssueMetricsCard } from "../components/issue-metrics-card";
import { IssueTransitionsCard } from "../components/issue-transitions-card";
import { useDatasetContext } from "../../context";
import { useState } from "react";
import { ZoomInOutlined } from "@ant-design/icons";
import { EpicTimeline } from "./components/epic-timeline";

export const IssueDetailsPage = () => {
  const { issueKey } = useNavigationContext();
  const { issues } = useDatasetContext();
  const issue = issues?.find((issue) => issue.key === issueKey);
  const isEpic = issue?.hierarchyLevel === HierarchyLevel.Epic;
  const children = isEpic
    ? issues?.filter((issue) => issue.parentKey === issueKey)
    : undefined;
  const [showTimeline, setShowTimeline] = useState(false);
  return issue ? (
    <>
      <h2>{issue.summary}</h2>
      <Row gutter={[8, 8]}>
        <Col md={12} sm={24}>
          <Space direction="vertical">
            <IssueDetailsCard issue={issue} />
          </Space>
        </Col>
        <Col md={12} sm={24}>
          <Space direction="vertical">
            <IssueMetricsCard issue={issue} />
            <IssueTransitionsCard issue={issue} />
          </Space>
        </Col>
      </Row>
      {isEpic ? (
        <>
          <Button
            style={{ float: "right" }}
            type="link"
            icon={<ZoomInOutlined />}
            onClick={() => setShowTimeline(true)}
          >
            Timeline
          </Button>
          <IssuesTable
            issues={children ?? []}
            parentEpic={issue}
            defaultSortField="started"
          />
          <Drawer
            title="Timeline"
            placement="bottom"
            onClose={() => setShowTimeline(false)}
            open={showTimeline}
            push={false}
            height="100%"
          >
            <Layout style={{ maxWidth: "1440px", margin: "auto" }}>
              <Layout.Content style={{ margin: "0 50px" }}>
                <EpicTimeline issues={children ?? []} epic={issue} />
              </Layout.Content>
            </Layout>
          </Drawer>
        </>
      ) : null}
    </>
  ) : null;
};
