import { Injectable } from '@nestjs/common';
import { DataError } from 'node-json-db';
import { Domain } from '../domain/entities/domains';
import { createHash } from 'crypto';
import { DomainsCache } from './database';

export type CreateDomainParams = Omit<Domain, 'id'>;

@Injectable()
export class DomainsRepository {
  constructor(private readonly cache: DomainsCache) {}

  async getDomains() {
    try {
      const domains = await this.cache.getObject<Domain[]>('/domains');
      return Object.values(domains);
    } catch (e) {
      if (e instanceof DataError) {
        return [];
      }
      throw e;
    }
  }

  async addDomain(params: CreateDomainParams) {
    const id = createHash('md5')
      .update(JSON.stringify(params))
      .digest('base64url');
    const domain = { ...params, id };
    await this.cache.push(`/domains/${id}`, domain);
    return domain;
  }
}
