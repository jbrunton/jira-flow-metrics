import { CreateDashboardParams, Dashboard, LocalDashboardsRepository } from "#entities/dashboards.mjs";
import { createHash } from "node:crypto";
import { LocalDatabase } from "./db.mts";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FlowDashboardsRepository extends LocalDashboardsRepository {
  constructor(private readonly db: LocalDatabase) {
    super();
  }

  override async getDashboards(): Promise<Dashboard[]> {
    return this.db.data.dashboards;
  }

  override async createDashboard(params: CreateDashboardParams): Promise<Dashboard> {
    const id = createHash("md5")
      .update(JSON.stringify(params))
      .digest("base64url");

    const dashboard = { ...params, id };
    this.db.data.dashboards.push(dashboard);
    await this.db.write();

    return dashboard;
  }
}
