import { Module } from "@nestjs/common";
import { DataSetsController } from "./datasets.controller";
import { SyncUseCase } from "@usecases/datasets/sync/sync-use-case";
import { CycleTimesUseCase } from "@usecases/cycle-times-use-case";

@Module({
  providers: [SyncUseCase, CycleTimesUseCase],
  controllers: [DataSetsController],
})
export class DataSetsModule {}
