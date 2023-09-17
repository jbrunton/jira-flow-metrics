import remove from "lodash/remove.js";
import { LocalDatabase } from "./db.mts";
import { Injectable } from "@nestjs/common";
import { CreateProjectParams, LocalProjectsRepository, Project } from "#entities/projects.mjs";
import { createHash } from "node:crypto";


@Injectable()
export class FlowProjectsRepository extends LocalProjectsRepository {
  constructor(private readonly db: LocalDatabase) {
    super();
  }

  override async getProjects(): Promise<Project[]> {
    return this.db.data.projects;
  }

  override async createProject(params: CreateProjectParams): Promise<Project> {
    const id = createHash("md5").update(`${params.name}:${params.jql}`).digest("base64url");
    const project = { ...params, id };
    this.db.data.projects.push(project);

    await this.db.write();

    return project;
  }

  override async removeProject(projectId: string): Promise<void> {
    remove(this.db.data.projects, (project) => project.id === projectId);
    await this.db.write();
  }

  override async updateSyncDate(projectId: string, lastSynced: Date): Promise<Project> {
    const project = this.db.data.projects.find(
      (project) => project.id === projectId,
    );
    project.lastSynced = lastSynced;

    await this.db.write();

    return project;
  }
}
