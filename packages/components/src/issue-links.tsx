import { Link } from "react-router-dom";
import { FC } from "react";
import { ExportOutlined } from "@ant-design/icons";
import { Tag } from "antd";

export type IssueLinkProps = {
  text: string;
  path: string;
  tag?: boolean;
};

export const IssueLink: FC<IssueLinkProps> = ({ text, path, tag }) => {
  const link = (
    <Link style={{ whiteSpace: "nowrap" }} to={path}>
      {text}
    </Link>
  );
  if (tag) {
    return <Tag>{link}</Tag>;
  }
  return link;
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
