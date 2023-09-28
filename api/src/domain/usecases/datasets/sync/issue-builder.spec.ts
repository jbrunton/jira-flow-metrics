import { JiraIssueBuilder } from './issue_builder';
import {
  exampleFields,
  exampleIssue,
  exampleStatuses,
} from '../../../../../test/fixtures/example-json';

describe('JiraIssueBuilder', () => {
  it('builds the issue and transition history with the given statuses', () => {
    const builder = new JiraIssueBuilder(
      exampleFields,
      exampleStatuses,
      'example.atlassian.net',
    );

    const result = builder.build(exampleIssue);

    expect(result).toEqual({
      created: new Date('2023-09-04T10:03:25.333Z'),
      externalUrl: 'https://example.atlassian.net/browse/TEST-101',
      hierarchyLevel: 'Story',
      issueType: 'Task',
      key: 'TEST-101',
      parentKey: undefined,
      resolution: 'Done',
      status: 'Done',
      statusCategory: 'Done',
      summary: 'My test issue',
      transitions: [
        {
          date: new Date('2023-09-04T13:37:24.303Z'),
          fromStatus: {
            category: 'To Do',
            name: 'backlog',
          },
          toStatus: {
            category: 'To Do',
            name: 'Ready for Development',
          },
        },
        {
          date: new Date('2023-09-05T14:22:32.068Z'),
          fromStatus: {
            category: 'To Do',
            name: 'Ready for Development',
          },
          toStatus: {
            category: 'In Progress',
            name: 'In Progress',
          },
        },
        {
          date: new Date('2023-09-06T08:02:11.840Z'),
          fromStatus: {
            category: 'In Progress',
            name: 'In Progress',
          },
          toStatus: {
            category: 'In Progress',
            name: 'In review',
          },
        },
        {
          date: new Date('2023-09-06T11:32:54.488Z'),
          fromStatus: {
            category: 'In Progress',
            name: 'In review',
          },
          toStatus: {
            category: 'In Progress',
            name: 'In staging',
          },
        },
        {
          date: new Date('2023-09-06T11:33:17.923Z'),
          fromStatus: {
            category: 'In Progress',
            name: 'In staging',
          },
          toStatus: {
            category: 'Done',
            name: 'Done',
          },
        },
      ],
    });
  });
});
