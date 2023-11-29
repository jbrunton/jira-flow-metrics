import { Link } from "react-router-dom";
import { issueDetailsPath } from "../navigation/paths";
import { FC } from "react";
import { Issue } from "../data/issues";
import { ExportOutlined } from "@ant-design/icons";

export type IssueLinkProps = {
  datasetId: string | undefined;
  issue: Pick<Issue, "key">;
};

export const IssueLink: FC<IssueLinkProps> = ({ datasetId, issue }) => {
  return (
    <Link
      style={{ whiteSpace: "nowrap" }}
      to={issueDetailsPath({ datasetId, issueKey: issue.key })}
    >
      {issue.key}
    </Link>
  );
};

export type IssueExternalLinkProps = {
  externalUrl: string;
};

export const IssueExternalLink: FC<IssueExternalLinkProps> = ({
  externalUrl,
}) => {
  return (
    <Link to={externalUrl} target="_blank">
      <ExportOutlined />
    </Link>
  );
};
