import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { DataSetsController } from './data-sets.controller';
import { DataSetsRepository } from './data-sets.repository';
import { DataSourcesRepository } from './data-sources.repository';

@Module({
  imports: [DataModule],
  providers: [DataSetsRepository, DataSourcesRepository],
  controllers: [DataSetsController],
})
export class DataSetsModule {}
