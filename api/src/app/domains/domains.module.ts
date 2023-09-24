import { Module } from '@nestjs/common';
import { DomainsController } from './domains.controller';
import { DataModule } from '@data/data.module';

@Module({
  imports: [DataModule],
  controllers: [DomainsController],
})
export class DomainsModule {}
