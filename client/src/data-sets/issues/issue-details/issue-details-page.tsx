import { Col, Row, Space } from "antd";
import { IssuesTable } from "../../../components/issues-table";
import { HierarchyLevel } from "../../../data/issues";
import { useNavigationContext } from "../../../navigation/context";
import { IssueSummaryCard } from "../components/issue-summary-card";
import { IssueMetricsCard } from "../components/issue-metrics-card";
import { IssueTransitionsCard } from "../components/issue-transitions-card";

export const IssueDetailsPage = () => {
  const { issue, issueKey, issues } = useNavigationContext();
  const isEpic = issue?.hierarchyLevel === HierarchyLevel.Epic;
  const children = isEpic
    ? issues?.filter((issue) => issue.parentKey === issueKey)
    : undefined;
  return issue ? (
    <>
      <Row gutter={[8, 8]}>
        <Col md={12} sm={24}>
          <Space direction="vertical">
            <IssueSummaryCard issue={issue} />
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
        <IssuesTable issues={children ?? []} parentEpic={issue} />
      ) : null}
    </>
  ) : null;
};
