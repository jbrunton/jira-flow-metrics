import { Version3Client } from "jira.js";
import { DomainsRepository } from "@entities/domains";
import { Logger } from "@nestjs/common";
import { Request } from "express";

const logger = new Logger("jira-client");

export const jiraClientFactory = async (
  request: Request,
  domainsRepo: DomainsRepository,
) => {
  const domainId = request.query.domainId as string;
  const domain = await domainsRepo.getDomain(domainId);

  logger.log(`Creating Jira client for host ${domain.host}`);

  return new Version3Client({
    host: `https://${domain.host}`,
    authentication: {
      basic: {
        email: domain.email,
        apiToken: domain.token,
      },
    },
    newErrorHandling: true,
  });
};
