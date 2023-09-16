import { Module } from '@nestjs/common';
import { DomainsController } from './domains.controller';
import { DomainsRepository } from './domains.repository';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  providers: [DomainsRepository],
  controllers: [DomainsController],
})
export class DomainsModule {}
