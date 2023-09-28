import { Injectable } from "@nestjs/common";
import { DataError } from "node-json-db";
import {
  CreateDomainParams,
  Domain,
  DomainsRepository,
} from "@entities/domains";
import { createHash } from "crypto";
import { DomainsCache } from "../database";

@Injectable()
export class LocalDomainsRepository extends DomainsRepository {
  constructor(private readonly cache: DomainsCache) {
    super();
  }

  async getDomains(): Promise<Domain[]> {
    try {
      const domains = await this.cache.getObject<Domain[]>("/domains");
      return Object.values(domains);
    } catch (e) {
      if (e instanceof DataError) {
        return [];
      }
      throw e;
    }
  }

  async getDomain(domainId: string): Promise<Domain> {
    const domain = await this.cache.getObject<Domain>(`/domains/${domainId}`);
    return domain;
  }

  async addDomain(params: CreateDomainParams): Promise<Domain> {
    const id = createHash("md5")
      .update(JSON.stringify(params))
      .digest("base64url");
    const domain = { ...params, id };
    await this.cache.push(`/domains/${id}`, domain);
    return domain;
  }
}
