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
      const dataSets = await this.cache.getObject<Record<string, DataSet>>(
        `/dataSets/${domainId}`,
      );
      return Object.values(dataSets);
    } catch (e) {
      if (e instanceof DataError) {
        return [];
      }
      return e;
    }
  }

  getDataset(domainId: string, dataSetId: string): Promise<DataSet> {
    return this.cache.getObject<DataSet>(`/dataSets/${domainId}/${dataSetId}`);
  }

  async addDataset(domainId: string, params: CreateDataSetParams) {
    const id = createHash("md5")
      .update(JSON.stringify(params))
      .digest("base64url");
    const dataSet = { ...params, id };
    await this.cache.push(`/dataSets/${domainId}/${id}`, dataSet);
    return dataSet;
  }
}
