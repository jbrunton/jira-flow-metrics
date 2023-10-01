import { Injectable } from "@nestjs/common";
import { Dataset, DatasetsRepository } from "@entities/datasets";
import { createHash } from "crypto";
import { DataError } from "node-json-db";
import { LocalCache } from "@data/database";

export type CreateDatasetParams = Omit<Dataset, "id">;

@Injectable()
export class LocalDatasetsRepository extends DatasetsRepository {
  constructor(private readonly cache: LocalCache) {
    super();
  }

  async getDatasets(domainId: string): Promise<Dataset[]> {
    try {
      const datasets = await this.cache.getObject<Record<string, Dataset>>(
        datasetsPath(domainId),
      );
      return Object.values(datasets);
    } catch (e) {
      if (e instanceof DataError) {
        return [];
      }
      return e;
    }
  }

  getDataset(domainId: string, datasetId: string): Promise<Dataset> {
    return this.cache.getObject<Dataset>(datasetPath(domainId, datasetId));
  }

  async addDataset(domainId: string, params: CreateDatasetParams) {
    const id = createHash("md5")
      .update(JSON.stringify(params))
      .digest("base64url");
    const dataset = { ...params, id };
    await this.cache.push(datasetPath(domainId, id), dataset);
    return dataset;
  }

  removeDataset(domainId: string, datasetId: string): Promise<void> {
    return this.cache.delete(datasetPath(domainId, datasetId));
  }
}

const datasetsPath = (domainId: string): string => `/datasets/${domainId}`;

const datasetPath = (domainId: string, datasetId: string): string =>
  `${datasetsPath(domainId)}/${datasetId}`;
