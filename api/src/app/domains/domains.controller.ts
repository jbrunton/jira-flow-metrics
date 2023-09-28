import { DomainsRepository } from "@entities/domains";
import { Body, Controller, Get, Post } from "@nestjs/common";
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

@Controller("domains")
export class DomainsController {
  constructor(private readonly repository: DomainsRepository) {}

  @Get()
  async getDomains() {
    const domains = await this.repository.getDomains();
    return domains.map(({ id, host, email, token }) => {
      const tokenSuffix = token.substring(token.length - 3, token.length);
      return {
        id,
        host,
        credentials: `${email} (***${tokenSuffix})`,
      };
    });
  }

  @Post()
  async createDomain(@Body() domain: CreateDomainBody) {
    const host = normaliseHost(domain.host);
    return await this.repository.addDomain({ ...domain, host });
  }
}

const normaliseHost = (host: string): string => {
  if (host.startsWith("https://") || host.startsWith("http://")) {
    const url = new URL(host);
    return url.host;
  }

  return host;
};
