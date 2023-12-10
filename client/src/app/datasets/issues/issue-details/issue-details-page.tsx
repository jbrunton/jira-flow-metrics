import { Col, Row, Space } from "antd";
import { IssuesTable } from "../../../components/issues-table";
import { HierarchyLevel } from "@entities/issues";
import { useNavigationContext } from "../../../navigation/context";
import { IssueDetailsCard } from "../components/issue-details-card";
import { IssueMetricsCard } from "../components/issue-metrics-card";
import { IssueTransitionsCard } from "../components/issue-transitions-card";
import { useDatasetContext } from "../../context";

export const IssueDetailsPage = () => {
  const { issueKey } = useNavigationContext();
  const { issues } = useDatasetContext();
  const issue = issues?.find((issue) => issue.key === issueKey);
  const isEpic = issue?.hierarchyLevel === HierarchyLevel.Epic;
  const children = isEpic
    ? issues?.filter((issue) => issue.parentKey === issueKey)
    : undefined;
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
        <IssuesTable
          issues={children ?? []}
          parentEpic={issue}
          defaultSortField="started"
        />
      ) : null}
    </>
  ) : null;
};
