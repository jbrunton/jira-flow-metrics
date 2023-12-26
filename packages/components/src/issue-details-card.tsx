import React from "react";
import { Issue } from "@jbrunton/flow-metrics";
import { Card, Descriptions, Space, Tag } from "antd";
import { formatTime } from "@jbrunton/flow-lib";
import { IssueResolution, IssueStatus } from "./issue-fields";
import { IssueExternalLink, IssueLink } from "./issue-links";

export type IssueDetailsCardProps = {
  issue: Issue;
  issuePath: string;
  parentPath?: string;
};

export const IssueDetailsCard: React.FC<IssueDetailsCardProps> = ({
  issue,
  issuePath,
  parentPath,
}) => {
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
            <IssueLink text={issue.key} path={issuePath} />
            <IssueExternalLink externalUrl={issue.externalUrl} />
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
        {issue.parent && parentPath ? (
          <Descriptions.Item label="Parent">
            <IssueLink text={issue.parent.summary} path={parentPath} tag />
          </Descriptions.Item>
        ) : null}
        <Descriptions.Item label="Components">
          <Space>
            {issue.components.map((component) => (
              <Tag key={`component-${component}`}>{component}</Tag>
            ))}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Labels">
          <Space>
            {issue.labels.map((label) => (
              <Tag key={`label-${label}`}>{label}</Tag>
            ))}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Assignee">{issue.assignee}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
