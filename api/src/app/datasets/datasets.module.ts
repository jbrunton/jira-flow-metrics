import { Module } from "@nestjs/common";
import { DatasetsController } from "./datasets.controller";
import { SyncUseCase } from "@usecases/datasets/sync/sync-use-case";
import { CycleTimesUseCase } from "@usecases/cycle-times-use-case";

@Module({
  providers: [SyncUseCase, CycleTimesUseCase],
  controllers: [DatasetsController],
})
export class DatasetsModule {}
