import { Version3Client } from 'jira.js';
import { Domain } from '../domains/types';
import { Logger } from '@nestjs/common';

const logger = new Logger('jira-client');

export const createJiraClient = (domain: Domain) => {
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
