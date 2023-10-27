import { Version3Client } from "jira.js";
import { Domain, DomainsRepository } from "@entities/domains";
import { Logger, Provider, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

const logger = new Logger("jira-client");

export const createJiraClient = (domain: Domain) => {
  console.info("***", domain);
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

export const jiraClientProvider: Provider = {
  scope: Scope.REQUEST,
  provide: Version3Client,
  inject: [REQUEST, DomainsRepository],
  useFactory: async (request: Request, domainsRepo: DomainsRepository) => {
    const domains = await domainsRepo.getDomains();
    const domainId = request.query.domainId;
    console.info({ domainId, domains });
    const domain = domains.find((domain) => domain.id === domainId);
    console.info({ domain });
    return createJiraClient(domain);
  },
};
