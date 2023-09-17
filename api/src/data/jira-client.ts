import { Version3Client } from 'jira.js';
import { Domain } from '../domains/types';

export const createJiraClient = (domain: Domain) =>
  new Version3Client({
    host: `https://${domain.host}`,
    authentication: {
      basic: {
        email: domain.email,
        apiToken: domain.token,
      },
    },
    newErrorHandling: true,
  });
