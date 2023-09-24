import { Version3Client } from 'jira.js';
import { Field } from '../domain/entities/issues';
import { isNil, reject } from 'rambda';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JiraFieldsRepository {
  constructor(private readonly client: Version3Client) {}

  async getFields(): Promise<Field[]> {
    const jiraFields = await this.client.issueFields.getFields();
    return reject(isNil)(
      jiraFields.map((field) => {
        if (field.id === undefined) {
          console.warn(`Missing id for field ${field}`);
          return null;
        }

        return {
          jiraId: field.id,
          name: field.name,
        };
      }),
    );
  }
}
