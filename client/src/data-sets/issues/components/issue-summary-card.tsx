import React from "react";
import { Issue, IssueStatus } from "../../../data/issues";
import { Card, Descriptions, Tag } from "antd";
import { categoryColors } from "./status-colors";
import { formatTime } from "../../../lib/format";

export type IssueSummaryCardProps = {
  issue: Issue;
};

export const IssueSummaryCard: React.FC<IssueSummaryCardProps> = ({
  issue,
}) => {
  const currentStatus: IssueStatus = {
    name: issue.status,
    category: issue.statusCategory,
  };
  return (
    <Card title="Summary" size="small">
      <Descriptions
        column={1}
        key={issue.key}
        colon={false}
        size="small"
        labelStyle={{ width: "35%", fontWeight: 500 }}
      >
        <Descriptions.Item label="Issue Type">
          {issue.issueType}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={categoryColors[currentStatus.category]}>
            {currentStatus.name}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Resolution">
          {issue.resolution}
        </Descriptions.Item>
        <Descriptions.Item label="Created">
          {formatTime(issue.created)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
