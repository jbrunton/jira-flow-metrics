import { Injectable } from '@nestjs/common';
import { JsonDB } from 'node-json-db';
import { Domain } from './types';
import { createHash } from 'crypto';

export type CreateDomainParams = Omit<Domain, 'id'>;

@Injectable()
export class DomainsRepository {
  constructor(private readonly cache: JsonDB) {}

  async getDomains() {
    const domains = await this.cache.getObject<Domain[]>('/domains');
    return Object.values(domains);
  }

  async addDomain(params: CreateDomainParams) {
    const id = createHash('md5')
      .update(JSON.stringify(params))
      .digest('base64url');
    const domain = { id, ...params };
    await this.cache.push(`/domains/${id}`, domain);
    return domain;
  }
}
