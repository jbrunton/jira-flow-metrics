import { DataModule } from "@data/data-module";
import { Test, TestingModule } from "@nestjs/testing";
import { DatasetsModule } from "./datasets.module";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { StorageModule } from "@data/storage/storage-module";
import { TestStorageModule } from "@fixtures/data/storage/test-storage-module";
import { buildIssue } from "@fixtures/factories/issue-factory";
import { IssuesRepository } from "@entities/issues";

jest.useFakeTimers().setSystemTime(Date.parse("2023-01-01T13:00:00.000Z"));

describe("DatasetsController", () => {
  let app: INestApplication;
  let issues: IssuesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModule, DatasetsModule],
    })
      .overrideModule(StorageModule)
      .useModule(TestStorageModule)
      .compile();

    app = module.createNestApplication();
    await app.init();

    issues = await module.get(IssuesRepository);
  });

  describe("GET /datasets/:datasetId/issues", () => {
    it("returns issues in the dataset", async () => {
      const datasetId = "123";

      await issues.setIssues(datasetId, [
        buildIssue({
          transitions: [],
          created: new Date("2023-01-01T07:00:00.000Z"),
        }),
      ]);

      const { body } = await request(app.getHttpServer())
        .get(`/datasets/${datasetId}/issues`)
        .expect(200);

      expect(body).toEqual([
        {
          created: "2023-01-01T07:00:00.000Z",
          externalUrl: "https://jira.example.com/browse/TEST-101",
          hierarchyLevel: "Story",
          key: "TEST-101",
          metrics: {},
          status: "Backlog",
          statusCategory: "To Do",
          summary: "Some issue 101",
          labels: [],
          transitions: [
            {
              date: "2023-01-01T07:00:00.000Z",
              fromStatus: {
                category: "To Do",
                name: "Created",
              },
              timeInStatus: 0.25,
              toStatus: {
                category: "To Do",
                name: "Backlog",
              },
              until: "2023-01-01T13:00:00.000Z",
            },
          ],
        },
      ]);
    });
  });

  describe("GET /datasets/:datasetId/statuses", () => {
    it("returns statuses for issues in the dataset", async () => {
      const datasetId = "123";

      await issues.setIssues(datasetId, [
        buildIssue({
          transitions: [],
          created: new Date("2023-01-01T07:00:00.000Z"),
        }),
      ]);

      const { body } = await request(app.getHttpServer())
        .get(`/datasets/${datasetId}/statuses`)
        .expect(200);

      expect(body).toEqual({
        Epic: [],
        Story: ["Created", "Backlog"],
      });
    });
  });
});
