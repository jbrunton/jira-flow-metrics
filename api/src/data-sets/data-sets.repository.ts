import { Injectable } from '@nestjs/common';
import { DataSet } from './types';
import { createHash } from 'crypto';
import { JsonDB } from 'node-json-db';

export type CreateDataSetParams = Omit<DataSet, 'id'>;

@Injectable()
export class DataSetsRepository {
  constructor(private readonly cache: JsonDB) {}

  async getDataSets() {
    const dataSets = await this.cache.getObject<DataSet[]>('/dataSets');
    return Object.values(dataSets);
  }

  async addDataSet(params: CreateDataSetParams) {
    const id = createHash('md5')
      .update(JSON.stringify(params))
      .digest('base64url');
    const dataSet = { id, ...params };
    await this.cache.push(`/dataSets/${id}`, dataSet);
    return dataSet;
  }
}
