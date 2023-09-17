// import { Inject, Injectable, Request, Scope } from '@nestjs/common';
// import { REQUEST } from '@nestjs/core';
//import { Request } from 'express';
import { Version3Client } from 'jira.js';
import { Domain } from 'src/domains/types';

// const email: string = process.env.JIRA_USER ?? '';
// const apiToken: string = process.env.JIRA_TOKEN ?? '';
// const host: string | undefined = process.env.JIRA_HOST;

// export const jiraClient = new Version3Client({
//   host,
//   authentication: {
//     basic: {
//       email,
//       apiToken,
//     },
//   },
//   newErrorHandling: true,
// });

export const createJiraClient = (domain: Domain) =>
  new Version3Client({
    host: domain.host,
    authentication: {
      basic: {
        email: domain.email,
        apiToken: domain.token,
      },
    },
    newErrorHandling: true,
  });

// @Injectable({ scope: Scope.REQUEST })
// export class JiraClient extends Version3Client {
//   constructor(@Inject(REQUEST) private request: Request) {
//     super()
//   }
// }
