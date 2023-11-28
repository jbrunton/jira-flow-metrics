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
        datasetsPath(),
      );
      return Object.values(datasets).filter(
        (dataset) => dataset.domainId === domainId,
      );
    } catch (e) {
      if (e instanceof DataError) {
        return [];
      }
      return e;
    }
  }

  async getDataset(datasetId: string): Promise<Dataset> {
    return this.cache.getObject<Dataset>(datasetPath(datasetId));
  }

  async addDataset(params: CreateDatasetParams): Promise<Dataset> {
    const id = createId(params);
    const dataset = { ...params, id };
    await this.cache.push(datasetPath(id), dataset);
    return dataset;
  }

  async updateDataset(
    datasetId: string,
    params: Partial<CreateDatasetParams>,
  ): Promise<Dataset> {
    const dataset = await this.getDataset(datasetId);
    Object.assign(dataset, params);
    await this.cache.push(datasetPath(datasetId), dataset);
    return dataset;
  }

  removeDataset(datasetId: string): Promise<void> {
    return this.cache.delete(datasetPath(datasetId));
  }

  async removeDatasets(domainId: string): Promise<void> {
    const datasets = await this.getDatasets(domainId);
    for (const dataset of datasets) {
      await this.removeDataset(dataset.id);
    }
  }
}

const datasetsPath = (): string => `/datasets`;

const datasetPath = (datasetId: string): string => `/datasets/${datasetId}`;
