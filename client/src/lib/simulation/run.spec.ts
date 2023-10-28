import { describe, it, expect, vitest } from "vitest";
import {
  Measurements,
  categorizeWeekday,
  computeThroughput,
  measure,
  run,
  runOnce,
  summarize,
} from "./run";
import { buildCompletedIssue } from "../../../test/fixtures/issue-factory";

describe("categorizeWeekday", () => {
  it("categorizes weekdays", () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(categorizeWeekday)).toEqual([
      "weekday",
      "weekday",
      "weekday",
      "weekday",
      "weekday",
      "weekend",
      "weekend",
    ]);
  });
});

describe("computeThroughput", () => {
  it("computes the throughput for a given ordered list of issues", () => {
    const issues = [
      buildCompletedIssue({
        metrics: {
          completed: new Date("2020-01-03T09:30:00.000Z"),
          cycleTime: 1,
        },
      }),
      buildCompletedIssue({
        metrics: {
          completed: new Date("2020-01-05T00:10:00.000Z"),
          cycleTime: 1,
        },
      }),
      buildCompletedIssue({
        metrics: {
          completed: new Date("2020-01-05T10:30:00.000Z"),
          cycleTime: 1,
        },
      }),
    ];
    expect(computeThroughput(issues)).toEqual([
      { date: new Date("2020-01-03T00:00:00.000Z"), count: 1 },
      { date: new Date("2020-01-04T00:00:00.000Z"), count: 0 },
      { date: new Date("2020-01-05T00:00:00.000Z"), count: 2 },
    ]);
  });
});

describe("measure", () => {
  const issues = [
    buildCompletedIssue({
      metrics: {
        cycleTime: 1,
        completed: new Date("2020-01-02T09:30:00.000Z"),
      },
    }),
    buildCompletedIssue({
      metrics: {
        cycleTime: 3,
        completed: new Date("2020-01-02T12:10:00.000Z"),
      },
    }),
    buildCompletedIssue({
      metrics: {
        cycleTime: 2,
        completed: new Date("2020-01-06T09:10:30.000Z"),
      },
    }),
    buildCompletedIssue({
      metrics: {
        cycleTime: 200,
        completed: new Date("2020-01-07T10:30:00.000Z"),
      },
    }),
  ];

  it("measures cycle times and throughput for the given issues", () => {
    expect(measure(issues, false)).toEqual({
      cycleTimes: [1, 3, 2, 200],
      throughputs: {
        weekend: [0, 0],
        weekday: [2, 0, 1, 1],
      },
    });
  });

  it("optionally excludes cycle time outliers", () => {
    expect(measure(issues, true)).toEqual({
      cycleTimes: [1, 3, 2],
      throughputs: {
        weekend: [0, 0],
        weekday: [2, 0, 1, 1],
      },
    });
  });
});

describe("runOnce", () => {
  it("runs the MCS once", () => {
    const measurements: Measurements = {
      cycleTimes: [2.5, 3.5, 5.5],
      throughputs: {
        weekend: [0],
        weekday: [1, 2],
      },
    };
    const startWeekday = 1;

    const generator = vitest.fn();
    generator
      .mockReturnValueOnce(1) // cycle time sample (3.5)
      .mockReturnValueOnce(0) // throughput sample #1
      .mockReturnValueOnce(0) // throughput sample #2
      .mockReturnValueOnce(0) // throughput sample #3
      .mockReturnValueOnce(1) // throughput sample #4
      .mockReturnValueOnce(1); // throughput sample #5

    // time | th. |   day   | backlog count
    // 3.5  |  -  | 4 (Thu) |  5  - cycle time sample is 3.5 days
    // 4.5  |  1  | 5 (Fri) |  4  - throughput sample #1
    // 4.5  |  0  | 6 (Sat) |  4  - throughput sample #2
    // 5.5  |  0  | 7 (Sun) |  4  - throughput sample #3
    // 6.5  |  2  | 1 (Mon) |  2  - throughput sample #4
    // 7.5  |  2  | 2 (Mon) |  0  - throughput sample #5
    expect(runOnce(5, measurements, startWeekday, false, generator)).toEqual(
      7.5,
    );
  });

  it("ignores lead times if excludeLeadTimes is true", () => {
    const measurements: Measurements = {
      cycleTimes: [2.5, 3.5, 5.5],
      throughputs: {
        weekend: [0],
        weekday: [1, 2],
      },
    };
    const startWeekday = 1;

    const generator = vitest.fn();
    generator
      .mockReturnValueOnce(1) // throughput sample #1
      .mockReturnValueOnce(0) // throughput sample #2
      .mockReturnValueOnce(0) // throughput sample #3
      .mockReturnValueOnce(0); // throughput sample #4

    // time | th. |   day   | backlog count
    //   1  |  2  | 1 (Mon) |  3  - throughput sample #1
    //   2  |  1  | 2 (Tue) |  2  - throughput sample #2
    //   3  |  1  | 3 (Wed) |  1  - throughput sample #3
    //   4  |  1  | 4 (Thu) |  0  - throughput sample #4
    expect(runOnce(5, measurements, startWeekday, true, generator)).toEqual(4);
  });
});

describe("run", () => {
  it("returns results for `runCount` runs of the simulation", () => {
    const measurements: Measurements = {
      cycleTimes: [2.5, 3.5, 5.5],
      throughputs: {
        weekend: [0],
        weekday: [1, 2],
      },
    };
    const startDate = new Date("2020-01-06T00:00:00.000Z");

    const generator = vitest.fn();
    generator
      .mockReturnValueOnce(1) // cycle time sample #1 (3.5)
      .mockReturnValueOnce(0) // throughput sample #1
      .mockReturnValueOnce(0) // throughput sample #2
      .mockReturnValueOnce(0) // throughput sample #3
      .mockReturnValueOnce(1) // throughput sample #4
      .mockReturnValueOnce(1) // throughput sample #5
      .mockReturnValueOnce(1) // cycle time sample #2 (3.5)
      .mockReturnValueOnce(0) // throughput sample #1
      .mockReturnValueOnce(0) // throughput sample #2
      .mockReturnValueOnce(0) // throughput sample #3
      .mockReturnValueOnce(1) // throughput sample #4
      .mockReturnValueOnce(0) // throughput sample #5
      .mockReturnValueOnce(0); // throughput sample #6
    expect(run(5, measurements, 2, startDate, false, generator)).toEqual([
      7.5, 8.5,
    ]);
  });
});

describe("summarize", () => {
  it("returns data for a histogram of durations", () => {
    const startDate = new Date("2020-01-01T00:00:00.000Z");
    const summary = summarize([1, 3, 10, 5, 9, 5, 3, 5], startDate, false);
    expect(summary).toEqual([
      {
        date: new Date("2020-01-02T00:00:00.000Z"),
        count: 1,
        annotation: undefined,
        annotationText: undefined,
        startPercentile: 0,
        endPercentile: 0.125,
        tooltip: "12% of trials finished by 2 Jan 2020",
      },
      {
        date: new Date("2020-01-04T00:00:00.000Z"),
        count: 2,
        annotation: undefined,
        annotationText: undefined,
        startPercentile: 0.125,
        endPercentile: 0.375,
        tooltip: "37% of trials finished by 4 Jan 2020",
      },
      {
        date: new Date("2020-01-06T00:00:00.000Z"),
        count: 3,
        annotation: "50th",
        annotationText: "2020-01-06T00:00:00.000Z",
        startPercentile: 0.375,
        endPercentile: 0.75,
        tooltip: "75% of trials finished by 6 Jan 2020",
      },
      {
        date: new Date("2020-01-10T00:00:00.000Z"),
        count: 1,
        annotation: "85th",
        annotationText: "2020-01-10T00:00:00.000Z",
        startPercentile: 0.75,
        endPercentile: 0.875,
        tooltip: "87% of trials finished by 10 Jan 2020",
      },
      {
        date: new Date("2020-01-11T00:00:00.000Z"),
        count: 1,
        annotation: "95th",
        annotationText: "2020-01-11T00:00:00.000Z",
        startPercentile: 0.875,
        endPercentile: 1,
        tooltip: "100% of trials finished by 11 Jan 2020",
      },
    ]);
  });
});
