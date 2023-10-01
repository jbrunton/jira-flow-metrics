export type Dataset = {
  id: string;
  name: string;
  jql: string;
};

export type DataSource = {
  name: string;
  type: "filter" | "project";
  jql: string;
};

export type CreateDatasetParams = Omit<Dataset, "id">;

export abstract class DatasetsRepository {
  abstract getDatasets(domainId: string): Promise<Dataset[]>;
  abstract getDataset(domainId: string, datasetId: string): Promise<Dataset>;
  abstract addDataset(domainId: string, params: CreateDatasetParams);
  abstract removeDataset(domainId: string, datasetId: string): Promise<void>;
}

export abstract class DataSourcesRepository {
  abstract getDataSources(query: string): Promise<DataSource[]>;
}
