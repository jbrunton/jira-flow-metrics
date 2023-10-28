export type Dataset = {
  id: string;
  name: string;
  jql: string;
  lastSync?: {
    date: Date;
    issueCount: number;
  };
};

export type DataSource = {
  name: string;
  type: "filter" | "project";
  jql: string;
};

export type CreateDatasetParams = Omit<Dataset, "id">;
export type UpdateDatasetParams = Partial<CreateDatasetParams>;

export abstract class DatasetsRepository {
  abstract getDatasets(domainId: string): Promise<Dataset[]>;
  abstract getDataset(domainId: string, datasetId: string): Promise<Dataset>;
  abstract addDataset(
    domainId: string,
    params: CreateDatasetParams,
  ): Promise<Dataset>;
  abstract updateDataset(
    domainId: string,
    datasetId: string,
    params: UpdateDatasetParams,
  ): Promise<Dataset>;
  abstract removeDataset(domainId: string, datasetId: string): Promise<void>;
}

export abstract class DataSourcesRepository {
  abstract getDataSources(query: string): Promise<DataSource[]>;
}
