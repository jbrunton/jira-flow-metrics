import { Version3Client } from 'jira.js';
import { DataSource, DataSourcesRepository } from '@entities/datasets';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class HttpJiraDataSourcesRepository extends DataSourcesRepository {
  constructor(private readonly client: Version3Client) {
    super();
  }

  async getDataSources(query: string): Promise<DataSource[]> {
    const projectsPage = await this.client.projects.searchProjects({
      query,
    });

    const filtersPage = await this.client.filters.getFiltersPaginated({
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
