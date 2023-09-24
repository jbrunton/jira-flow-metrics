import { Injectable } from '@nestjs/common';
import { DataSet } from '../domain/entities/datasets';
import { createHash } from 'crypto';
import { DataError } from 'node-json-db';
import { LocalCache } from '../data/database';

export type CreateDataSetParams = Omit<DataSet, 'id'>;

@Injectable()
export class DataSetsRepository {
  constructor(private readonly cache: LocalCache) {}

  async getDataSets(domainId: string): Promise<DataSet[]> {
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

  getDataSet(domainId: string, dataSetId: string): Promise<DataSet> {
    return this.cache.getObject<DataSet>(`/dataSets/${domainId}/${dataSetId}`);
  }

  async addDataSet(domainId: string, params: CreateDataSetParams) {
    const id = createHash('md5')
      .update(JSON.stringify(params))
      .digest('base64url');
    const dataSet = { ...params, id };
    await this.cache.push(`/dataSets/${domainId}/${id}`, dataSet);
    return dataSet;
  }
}
