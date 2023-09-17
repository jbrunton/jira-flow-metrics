import { Injectable } from '@nestjs/common';
import { DataSet } from './types';
import { createHash } from 'crypto';
import { DataError, JsonDB } from 'node-json-db';

export type CreateDataSetParams = Omit<DataSet, 'id'>;

@Injectable()
export class DataSetsRepository {
  constructor(private readonly cache: JsonDB) {}

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
