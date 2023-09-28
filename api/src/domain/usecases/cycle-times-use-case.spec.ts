import {
  exampleFields,
  exampleIssue,
  exampleStatuses,
} from "../../../test/fixtures/example-json";
import { CycleTimesUseCase } from "./cycle-times-use-case";
import { JiraIssueBuilder } from "./datasets/sync/issue_builder";

describe("CycleTimesUseCase", () => {
  it("computes cycle time metrics", () => {
    const cycleTimes = new CycleTimesUseCase();

    const issue = new JiraIssueBuilder(
      exampleFields,
      exampleStatuses,
      "example.atlassian.net",
    ).build(exampleIssue);

    const [result] = cycleTimes.exec([issue]);

    expect(result).toEqual(
      expect.objectContaining({
        cycleTime: 0.8824751736111112,
        started: new Date("2023-09-05T14:22:32.068Z"),
        completed: new Date("2023-09-06T11:33:17.923Z"),
      }),
    );
  });
});
