import { Injectable } from "@nestjs/common";
import {
  CreateDatasetParams,
  Dataset,
  DatasetsRepository,
} from "@entities/datasets";
import { DataError } from "node-json-db";
import { DataCache } from "@data/storage/storage";
import { createId } from "@data/local/id";

@Injectable()
export class LocalDatasetsRepository extends DatasetsRepository {
  constructor(private readonly cache: DataCache) {
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

  async addDataset(
    domainId: string,
    params: CreateDatasetParams,
  ): Promise<Dataset> {
    const id = createId(params);
    const dataset = { ...params, id };
    await this.cache.push(datasetPath(domainId, id), dataset);
    return dataset;
  }

  async updateDataset(
    domainId: string,
    datasetId: string,
    params: Partial<CreateDatasetParams>,
  ): Promise<Dataset> {
    const dataset = await this.getDataset(domainId, datasetId);
    Object.assign(dataset, params);
    await this.cache.push(datasetPath(domainId, datasetId), dataset);
    return dataset;
  }

  removeDataset(domainId: string, datasetId: string): Promise<void> {
    return this.cache.delete(datasetPath(domainId, datasetId));
  }
}

const datasetsPath = (domainId: string): string => `/datasets/${domainId}`;

const datasetPath = (domainId: string, datasetId: string): string =>
  `${datasetsPath(domainId)}/${datasetId}`;
