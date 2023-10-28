import { DataModule } from "@data/data-module";
import { Test, TestingModule } from "@nestjs/testing";
import { DatasetsModule } from "./datasets.module";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { DatasetsRepository } from "@entities/datasets";
import { DomainsRepository } from "@entities/domains";
import { StorageModule } from "@data/storage/storage-module";
import { TestStorageModule } from "@fixtures/data/storage/test-storage-module";

describe("DatasetsController", () => {
  let app: INestApplication;
  let datasetsRepository: DatasetsRepository;
  let domainId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModule, DatasetsModule],
    })
      .overrideModule(StorageModule)
      .useModule(TestStorageModule)
      .compile();

    app = module.createNestApplication();
    await app.init();

    const domainsRepository = await module.get(DomainsRepository);
    const { id } = await domainsRepository.addDomain({
      host: "https://my-domain.example.com",
      email: "me@example.com",
      token: "my-token",
    });
    domainId = id;

    datasetsRepository = await module.get(DatasetsRepository);
  });

  describe("GET /datasets", () => {
    it("returns stored datasets", async () => {
      const dataset = await datasetsRepository.addDataset(domainId, {
        name: "My Dataset",
        jql: "proj = MyProject",
      });

      await request(app.getHttpServer())
        .get(`/datasets?domainId=${domainId}`)
        .expect(200, [dataset]);
    });
  });

  describe("POST /datasets", () => {
    it("stores datasets", async () => {
      const params = {
        name: "My Dataset",
        jql: "proj = MyProject",
      };

      await request(app.getHttpServer())
        .post(`/datasets?domainId=${domainId}`)
        .send(params)
        .expect(201, {
          id: "0EJs5gv4vHf5eufVqm7gig",
          ...params,
        });
    });
  });
});
