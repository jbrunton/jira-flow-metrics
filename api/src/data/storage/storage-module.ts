import { Module } from "@nestjs/common";
import { DataCache, DomainsCache } from "./storage";

@Module({
  providers: [DomainsCache, DataCache],
  exports: [DomainsCache, DataCache],
})
export class StorageModule {}
