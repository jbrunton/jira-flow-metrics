import { FC } from "react";

export type IssueLinkProps = {
  text: string;
  path: string;
  tag?: boolean;
};

export type IssueExternalLinkProps = {
  externalUrl: string;
};

export type IssueLinkComponent = FC<IssueLinkProps>;

export type IssueExternalLinkComponent = FC<IssueExternalLinkProps>;
