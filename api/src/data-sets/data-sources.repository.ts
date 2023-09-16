import { Version3Client } from 'jira.js';
import { DataSource } from './types';

export class DataSourcesRepository {
  async getDataSources(query: string): Promise<DataSource[]> {
    const projectsPage = await client.projects.searchProjects({
      query,
    });

    const filtersPage = await client.filters.getFiltersPaginated({
      filterName: query,
      expand: 'jql',
    });

    const projects: DataSource[] = projectsPage.values.map((project) => ({
      name: `${project.name} (${project.key})`,
      jql: `project=${project.key}`,
      type: 'project',
    }));

    const filters: DataSource[] = filtersPage.values.map((filter) => ({
      name: filter.name,
      jql: filter.jql,
      type: 'filter',
    }));

    return [...projects, ...filters];
  }
}

const email: string = process.env.JIRA_USER ?? '';
const apiToken: string = process.env.JIRA_TOKEN ?? '';
const host: string | undefined = process.env.JIRA_HOST;

export const client = new Version3Client({
  host,
  authentication: {
    basic: {
      email,
      apiToken,
    },
  },
  newErrorHandling: true,
});
