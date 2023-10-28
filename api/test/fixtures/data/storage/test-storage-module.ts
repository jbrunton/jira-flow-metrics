import { DataCache, DomainsCache } from "@data/storage/storage";
import { Module } from "@nestjs/common";
import { TestDataCache, TestDomainsCache } from "./test-storage";

@Module({
  providers: [
    {
      provide: DataCache,
      useClass: TestDataCache,
    },
    {
      provide: DomainsCache,
      useClass: TestDomainsCache,
    },
  ],
  exports: [DataCache, DomainsCache],
})
export class TestStorageModule {}
