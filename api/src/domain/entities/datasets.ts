export type DataSet = {
  id: string;
  name: string;
  jql: string;
};

export type DataSource = {
  name: string;
  type: "filter" | "project";
  jql: string;
};

export type CreateDataSetParams = Omit<DataSet, "id">;

export abstract class DatasetsRepository {
  abstract getDatasets(domainId: string): Promise<DataSet[]>;
  abstract getDataset(domainId: string, datasetId: string): Promise<DataSet>;
  abstract addDataset(domainId: string, params: CreateDataSetParams);
  abstract removeDataset(domainId: string, datasetId: string): Promise<void>;
}

export abstract class DataSourcesRepository {
  abstract getDataSources(query: string): Promise<DataSource[]>;
}
