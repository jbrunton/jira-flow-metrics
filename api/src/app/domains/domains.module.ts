import { Module } from "@nestjs/common";
import { DomainsController } from "./domains.controller";

@Module({
  imports: [],
  controllers: [DomainsController],
})
export class DomainsModule {}
