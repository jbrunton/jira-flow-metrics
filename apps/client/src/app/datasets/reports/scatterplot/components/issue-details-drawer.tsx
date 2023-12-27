import { Drawer, Space } from "antd";
import React, { ReactElement } from "react";
import { Issue } from "@jbrunton/flow-metrics";
import {
  IssueDetailsCard,
  IssueMetricsCard,
  IssueTransitionsCard,
} from "@jbrunton/flow-components";
import { useNavigationContext } from "@app/navigation/context";
import { issueDetailsPath } from "@app/navigation/paths";
import { IssueExternalLink, IssueLink } from "@app/datasets/components/foo";

const IssueDetails = ({ issue }: { issue: Issue }): ReactElement => {
  const { datasetId } = useNavigationContext();
  const issuePath = issueDetailsPath({ issueKey: issue.key, datasetId });
  const parentPath = issueDetailsPath({
    issueKey: issue.parentKey,
    datasetId,
  });
  return (
    <>
      <h2>{issue.summary}</h2>
      <Space direction="vertical">
        <IssueDetailsCard
          issue={issue}
          issuePath={issuePath}
          parentPath={parentPath}
          IssueLinkComponent={IssueLink}
          IssueExternalLinkComponent={IssueExternalLink}
        />
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
