import { Body, Controller, Get, Post } from '@nestjs/common';
import { DomainsRepository } from './domains.repository';
import { ApiProperty } from '@nestjs/swagger';

class CreateDomainBody {
  @ApiProperty()
  host: string;

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
    return await this.repository.addDomain(domain);
  }
}
