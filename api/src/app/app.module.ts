import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { DomainsModule } from "./domains/domains.module";
import { DatasetsModule } from "./datasets/datasets.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "..", "client", "dist"),
      exclude: ["/api/(.*)"],
    }),
    DomainsModule,
    DatasetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
