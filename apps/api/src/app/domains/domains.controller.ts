import { DataSourcesRepository, DatasetsRepository } from "@entities/datasets";
import { Domain, DomainsRepository } from "@entities/domains";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { URL } from "url";

class CreateDomainBody {
  @ApiProperty()
  host: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;
}

class CreateDatasetBody {
  @ApiProperty()
  name: string;

  @ApiProperty()
  jql: string;
}

@Controller("domains")
export class DomainsController {
  constructor(
    private readonly domains: DomainsRepository,
    private readonly datasets: DatasetsRepository,
    private readonly dataSources: DataSourcesRepository,
  ) {}

  @Get()
  async getDomains() {
    const domains = await this.domains.getDomains();
    return domains.map(domainToResponse);
  }

  @Post()
  async createDomain(@Body() params: CreateDomainBody) {
    const host = normaliseHost(params.host);
    const domain = await this.domains.addDomain({ ...params, host });
    return domainToResponse(domain);
  }

  @Delete(":domainId")
  async deleteDomain(@Param("domainId") domainId) {
    await this.datasets.removeDatasets(domainId);
    await this.domains.removeDomain(domainId);
  }

  @Get(":domainId/datasets")
  async getDatasets(@Param("domainId") domainId: string) {
    return this.datasets.getDatasets(domainId);
  }

  @Post(":domainId/datasets")
  async createDataset(
    @Param("domainId") domainId: string,
    @Body() body: CreateDatasetBody,
  ) {
    return this.datasets.addDataset({
      domainId,
      ...body,
      workflow: [],
      statuses: [],
    });
  }

  @Get(":domainId/sources")
  async getDataSources(@Param("domainId") domainId: string, query: string) {
    const domain = await this.domains.getDomain(domainId);
    return this.dataSources.getDataSources({ domain, query });
  }
}

const normaliseHost = (host: string): string => {
  if (host.startsWith("https://") || host.startsWith("http://")) {
    const url = new URL(host);
    return url.host;
  }

  return host;
};

const domainToResponse = ({ id, host, email, token }: Domain) => {
  const tokenSuffix = token.substring(token.length - 3, token.length);
  return {
    id,
    host,
    credentials: `${email} (***${tokenSuffix})`,
  };
};
