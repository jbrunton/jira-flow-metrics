import { Module } from "@nestjs/common";
import { DatasetsController } from "./datasets.controller";
import { SyncUseCase } from "@usecases/datasets/sync/sync-use-case";
@Module({
  providers: [SyncUseCase],
  controllers: [DatasetsController],
})
export class DatasetsModule {}
