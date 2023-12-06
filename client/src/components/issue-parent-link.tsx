import { Tag } from "antd";
import { Link } from "react-router-dom";
import { Issue } from "../data/issues";
import { FC } from "react";
import { issueDetailsPath } from "../navigation/paths";

export type IssueParentLinkProps = {
  parent: Issue;
  datasetId?: string;
};

export const IssueParentLink: FC<IssueParentLinkProps> = ({
  datasetId,
  parent,
}) => (
  <Tag>
    <Link to={issueDetailsPath({ datasetId, issueKey: parent.key })}>
      {parent.summary}
    </Link>
  </Tag>
);
