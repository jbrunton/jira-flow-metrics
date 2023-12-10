import React from "react";
import { Issue } from "@entities/issues";
import { Card, Descriptions, Space, Tag } from "antd";
import { formatTime } from "@lib/format";
import { issueDetailsPath } from "../../../navigation/paths";
import { useNavigationContext } from "../../../navigation/context";
import { Link } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";
import { IssueResolution, IssueStatus } from "../../../components/issue-fields";
import { IssueParentLink } from "../../../components/issue-parent-link";

export type IssueDetailsCardProps = {
  issue: Issue;
};

export const IssueDetailsCard: React.FC<IssueDetailsCardProps> = ({
  issue,
}) => {
  const { datasetId } = useNavigationContext();
  return (
    <Card title="Details" size="small">
      <Descriptions
        column={1}
        key={issue.key}
        colon={false}
        size="small"
        labelStyle={{ width: "35%", fontWeight: 500 }}
      >
        <Descriptions.Item label="Key">
          <Space direction="horizontal">
            <Link to={issueDetailsPath({ datasetId, issueKey: issue.key })}>
              {issue.key}
            </Link>
            <Link to={issue.externalUrl} target="_blank">
              <ExportOutlined />
            </Link>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Issue Type">
          {issue.issueType}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <IssueStatus {...issue} />
        </Descriptions.Item>
        <Descriptions.Item label="Resolution">
          <IssueResolution {...issue} />
        </Descriptions.Item>
        <Descriptions.Item label="Created">
          {formatTime(issue.created)}
        </Descriptions.Item>
        {issue.parent ? (
          <Descriptions.Item label="Parent">
            <IssueParentLink parent={issue.parent} datasetId={datasetId} />
          </Descriptions.Item>
        ) : null}
        <Descriptions.Item label="Labels">
          <Space>
            {issue.labels.map((label) => (
              <Tag key={`label-${label}`}>{label}</Tag>
            ))}
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
