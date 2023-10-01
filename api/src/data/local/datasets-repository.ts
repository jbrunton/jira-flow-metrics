import { Injectable } from "@nestjs/common";
import { DataSet, DatasetsRepository } from "@entities/datasets";
import { createHash } from "crypto";
import { DataError } from "node-json-db";
import { LocalCache } from "@data/database";

export type CreateDataSetParams = Omit<DataSet, "id">;

@Injectable()
export class LocalDatasetsRepository extends DatasetsRepository {
  constructor(private readonly cache: LocalCache) {
    super();
  }

  async getDatasets(domainId: string): Promise<DataSet[]> {
    try {
      const datasets = await this.cache.getObject<Record<string, DataSet>>(
        `/datasets/${domainId}`,
      );
      return Object.values(datasets);
    } catch (e) {
      if (e instanceof DataError) {
        return [];
      }
      return e;
    }
  }

  getDataset(domainId: string, datasetId: string): Promise<DataSet> {
    return this.cache.getObject<DataSet>(`/datasets/${domainId}/${datasetId}`);
  }

  async addDataset(domainId: string, params: CreateDataSetParams) {
    const id = createHash("md5")
      .update(JSON.stringify(params))
      .digest("base64url");
    const dataset = { ...params, id };
    await this.cache.push(`/datasets/${domainId}/${id}`, dataset);
    return dataset;
  }
}
