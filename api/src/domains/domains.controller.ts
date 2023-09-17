import { Body, Controller, Get, Post } from '@nestjs/common';
import { DomainsRepository } from '../data/domains.repository';
import { ApiProperty } from '@nestjs/swagger';
import { URL } from 'url';

class CreateDomainBody {
  @ApiProperty()
  host: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;
}

@Controller('domains')
export class DomainsController {
  constructor(private readonly repository: DomainsRepository) {}

  @Get()
  async getDomains() {
    const domains = await this.repository.getDomains();
    return domains;
  }

  @Post()
  async createDomain(@Body() domain: CreateDomainBody) {
    const host = normaliseHost(domain.host);
    return await this.repository.addDomain({ ...domain, host });
  }
}

const normaliseHost = (host: string): string => {
  if (host.startsWith('https://') || host.startsWith('http://')) {
    const url = new URL(host);
    return url.host;
  }

  return host;
};
