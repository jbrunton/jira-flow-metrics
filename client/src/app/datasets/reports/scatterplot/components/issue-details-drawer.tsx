import { Drawer, Space } from "antd";
import React, { ReactElement } from "react";
import { Issue } from "@entities/issues";
import { IssueDetailsCard } from "../../../issues/components/issue-details-card";
import { IssueMetricsCard } from "../../../issues/components/issue-metrics-card";
import { IssueTransitionsCard } from "../../../issues/components/issue-transitions-card";

const IssueDetails = ({ issue }: { issue: Issue }): ReactElement => {
  return (
    <>
      <h2>{issue.summary}</h2>
      <Space direction="vertical">
        <IssueDetailsCard issue={issue} />
        <IssueMetricsCard issue={issue} />
        <IssueTransitionsCard issue={issue} />
      </Space>
    </>
  );
};

export type IssueDetailsDrawerProps = {
  selectedIssues: Issue[];
  open: boolean;
  onClose: () => void;
};

export const IssueDetailsDrawer: React.FC<IssueDetailsDrawerProps> = ({
  selectedIssues,
  open,
  onClose,
}) => (
  <Drawer
    placement="right"
    width="30%"
    closable={false}
    onClose={onClose}
    open={open}
  >
    {selectedIssues.map((issue) => (
      <IssueDetails key={issue.key} issue={issue} />
    ))}
  </Drawer>
);
