export type Domain = {
  id: string;
  host: string;
  email: string;
  token: string;
};

export type CreateDomainParams = Omit<Domain, "id">;

export abstract class DomainsRepository {
  abstract getDomains(): Promise<Domain[]>;
  abstract getDomain(domainId: string): Promise<Domain>;
  abstract addDomain(params: CreateDomainParams): Promise<Domain>;
  abstract removeDomain(domainId: string): Promise<void>;
}
