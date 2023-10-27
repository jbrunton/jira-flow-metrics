import { Global, Module } from "@nestjs/common";
import { DataCache, DomainsCache } from "./storage";

@Global()
@Module({
  providers: [DomainsCache, DataCache],
  exports: [DomainsCache, DataCache],
})
export class StorageModule {}
