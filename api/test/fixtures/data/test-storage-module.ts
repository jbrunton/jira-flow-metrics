import { DataCache, DomainsCache } from "@data/storage";
import { Global, Module } from "@nestjs/common";
import { TestDataCache, TestDomainsCache } from "./test-storage";

@Global()
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
