import { HierarchyLevel, Status, StatusCategory } from "../types";
import { getFlowMetrics } from "./get-flow-metrics";
import { buildIssue } from "../fixtures/issue-factory";

jest.useFakeTimers();

describe("getFlowMetrics", () => {
  const backlog: Status = {
    jiraId: "12",
    name: "Backlog",
    category: StatusCategory.ToDo,
  };

  const inProgress: Status = {
    jiraId: "34",
    name: "In Progress",
    category: StatusCategory.InProgress,
  };

  const inReview: Status = {
    jiraId: "42",
    name: "In Review",
    category: StatusCategory.InProgress,
  };

  const done: Status = {
    jiraId: "56",
    name: "Done",
    category: StatusCategory.Done,
  };

  const devComplete: Status = {
    jiraId: "78",
    name: "Dev Complete",
    category: StatusCategory.Done,
  };

  const orderedStatuses = [
    "Created",
    "Backlog",
    "In Progress",
    "In Review",
    "Dev Complete",
    "Done",
  ];

  describe("for stories", () => {
    it("computes cycle time metrics", () => {
      const startedDate = new Date("2023-09-05T14:22:32.068Z");
      const completedDate = new Date("2023-09-06T11:33:17.923Z");

      const issue = buildIssue({
        status: "Done",
        statusCategory: StatusCategory.Done,
        created: new Date("2023-09-04T10:03:25.333Z"),
        transitions: [
          {
            date: new Date("2023-09-04T13:37:24.303Z"),
            fromStatus: backlog,
            toStatus: {
              name: "Ready for Development",
              category: StatusCategory.ToDo,
            },
          },
          {
            date: startedDate,
            fromStatus: {
              name: "Ready for Development",
              category: StatusCategory.ToDo,
            },
            toStatus: {
              name: "In Progress",
              category: StatusCategory.InProgress,
            },
          },
          {
            date: new Date("2023-09-06T08:02:11.840Z"),
            fromStatus: {
              name: "In Progress",
              category: StatusCategory.InProgress,
            },
            toStatus: {
              name: "In review",
              category: StatusCategory.InProgress,
            },
          },
          {
            date: new Date("2023-09-06T11:32:54.488Z"),
            fromStatus: {
              name: "In review",
              category: StatusCategory.InProgress,
            },
            toStatus: {
              name: "In staging",
              category: StatusCategory.InProgress,
            },
          },
          {
            date: completedDate,
            fromStatus: {
              name: "In staging",
              category: StatusCategory.InProgress,
            },
            toStatus: {
              name: "Done",
              category: StatusCategory.Done,
            },
          },
        ],
        metrics: {},
      });

      const [result] = getFlowMetrics([issue], false, orderedStatuses);

      expect(result.metrics).toEqual({
        cycleTime: 0.8824537037037037,
        started: startedDate,
        completed: completedDate,
      });
    });

    describe("when the issue was paused", () => {
      const firstStartedDate = new Date("2023-01-01T10:30:00.000Z");
      const stoppedDate = new Date("2023-01-01T12:30:00.000Z");
      const secondStartedDate = new Date("2023-01-01T14:30:00.000Z");
      const completedDate = new Date("2023-01-01T16:30:00.000Z");

      const issue = buildIssue({
        transitions: [
          {
            date: firstStartedDate,
            fromStatus: backlog,
            toStatus: inProgress,
          },
          {
            date: stoppedDate,
            fromStatus: inProgress,
            toStatus: backlog,
          },
          {
            date: secondStartedDate,
            fromStatus: backlog,
            toStatus: inProgress,
          },
          {
            date: completedDate,
            fromStatus: inProgress,
            toStatus: done,
          },
        ],
      });

      it("uses the first started date", () => {
        const [result] = getFlowMetrics([issue], false, orderedStatuses);

        expect(result.metrics).toEqual(
          expect.objectContaining({
            started: firstStartedDate,
            completed: completedDate,
          }),
        );
      });

      it("excludes the paused status time when includeWaitTime = false", () => {
        const [result] = getFlowMetrics([issue], false, orderedStatuses);

        expect(result.metrics).toEqual(
          expect.objectContaining({
            cycleTime: 0.16666666666666666,
          }),
        );
      });

      it("includes the paused status time when includeWaitTime = true", () => {
        const [result] = getFlowMetrics([issue], true, orderedStatuses);

        expect(result.metrics).toEqual(
          expect.objectContaining({
            cycleTime: 0.25,
          }),
        );
      });
    });

    describe("when the issue was restarted", () => {
      const startedDate = new Date("2023-01-01T10:30:00.000Z");
      const firstCompletedDate = new Date("2023-01-01T12:30:00.000Z");
      const restartedDate = new Date("2023-01-01T14:30:00.000Z");
      const secondCompletedDate = new Date("2023-01-01T16:30:00.000Z");

      const issue = buildIssue({
        transitions: [
          {
            date: startedDate,
            fromStatus: backlog,
            toStatus: inProgress,
          },
          {
            date: firstCompletedDate,
            fromStatus: inProgress,
            toStatus: done,
          },
          {
            date: restartedDate,
            fromStatus: done,
            toStatus: inProgress,
          },
          {
            date: secondCompletedDate,
            fromStatus: inProgress,
            toStatus: done,
          },
        ],
      });

      it("uses the last completed date", () => {
        const [result] = getFlowMetrics([issue], false, orderedStatuses);

        expect(result.metrics).toEqual(
          expect.objectContaining({
            started: startedDate,
            completed: secondCompletedDate,
          }),
        );
      });

      it("excludes the paused status time when includeWaitTime = false", () => {
        const [result] = getFlowMetrics([issue], false, orderedStatuses);

        expect(result.metrics).toEqual(
          expect.objectContaining({
            cycleTime: 0.16666666666666666,
          }),
        );
      });

      it("includes the paused status time when includeWaitTime = true", () => {
        const [result] = getFlowMetrics([issue], true, orderedStatuses);

        expect(result.metrics).toEqual(
          expect.objectContaining({
            cycleTime: 0.25,
          }),
        );
      });
    });

    it("uses the first completed date if an issue is moved through several done statuses", () => {
      const startedDate = new Date("2023-01-01T10:30:00.000Z");
      const devCompletedDate = new Date("2023-01-01T13:30:00.000Z");
      const doneDate = new Date("2023-01-01T16:30:00.000Z");

      const issue = buildIssue({
        transitions: [
          {
            date: startedDate,
            fromStatus: backlog,
            toStatus: inProgress,
          },
          {
            date: devCompletedDate,
            fromStatus: inProgress,
            toStatus: devComplete,
          },
          {
            date: doneDate,
            fromStatus: devComplete,
            toStatus: done,
          },
        ],
      });

      const [result] = getFlowMetrics([issue], false, orderedStatuses);

      expect(result.metrics).toEqual({
        started: startedDate,
        completed: devCompletedDate,
        cycleTime: 0.125,
      });
    });

    describe("when the issue is in progress", () => {
      const startedDate = new Date("2023-01-01T10:30:00.000Z");
      const pausedDate = new Date("2023-01-01T13:30:00.000Z");
      const now = new Date("2023-01-02T10:30:00.000Z");
      jest.setSystemTime(now);

      const issue = buildIssue({
        transitions: [
          {
            date: startedDate,
            fromStatus: backlog,
            toStatus: inProgress,
          },
          {
            date: pausedDate,
            fromStatus: inProgress,
            toStatus: backlog,
          },
        ],
      });

      it("returns the age of the issue", () => {
        const [result] = getFlowMetrics([issue], true, orderedStatuses);

        expect(result.metrics).toEqual({
          started: startedDate,
          cycleTime: 1,
        });
      });

      it("excludes the current status when includeWaitTime is false", () => {
        const [result] = getFlowMetrics([issue], false, orderedStatuses);

        expect(result.metrics).toEqual({
          started: startedDate,
          cycleTime: 0.125,
        });
      });
    });

    describe("when given fromStatus and toStatus parameters", () => {
      it("computes the cycle time between the parameters", () => {
        const startedDate = new Date("2023-01-01T10:30:00.000Z");
        const inReviewDate = new Date("2023-01-01T13:30:00.000Z");
        const doneDate = new Date("2023-01-01T16:30:00.000Z");

        const issue = buildIssue({
          transitions: [
            {
              date: startedDate,
              fromStatus: backlog,
              toStatus: inProgress,
            },
            {
              date: inReviewDate,
              fromStatus: inProgress,
              toStatus: inReview,
            },
            {
              date: doneDate,
              fromStatus: inReview,
              toStatus: done,
            },
          ],
        });

        const [result] = getFlowMetrics(
          [issue],
          false,
          orderedStatuses,
          inReview.name,
          done.name,
        );

        expect(result.metrics).toEqual({
          started: inReviewDate,
          completed: doneDate,
          cycleTime: 0.125,
        });
      });

      it("computes the cycle time when statuses are skipped", () => {
        const inReviewDate = new Date("2023-01-01T13:30:00.000Z");
        const doneDate = new Date("2023-01-01T16:30:00.000Z");

        const issue = buildIssue({
          transitions: [
            {
              date: inReviewDate,
              fromStatus: backlog,
              toStatus: inReview,
            },
            {
              date: doneDate,
              fromStatus: inReview,
              toStatus: done,
            },
          ],
        });

        const [result] = getFlowMetrics(
          [issue],
          false,
          orderedStatuses,
          inProgress.name,
          done.name,
        );

        expect(result.metrics).toEqual({
          started: inReviewDate,
          completed: doneDate,
          cycleTime: 0.125,
        });
      });
    });
  });

  describe("for epics", () => {
    const story1Started = new Date("2023-01-01T10:30:00.000Z");
    const story2Started = new Date("2023-01-01T12:30:00.000Z");
    const story1Completed = new Date("2023-01-02T14:30:00.000Z");
    const story2Completed = new Date("2023-01-02T16:30:00.000Z");

    const epic = buildIssue({
      issueType: "Epic",
      hierarchyLevel: HierarchyLevel.Epic,
      statusCategory: StatusCategory.Done,
      transitions: [],
    });

    const story1 = buildIssue({
      parentKey: epic.key,
      transitions: [
        {
          date: story1Started,
          fromStatus: backlog,
          toStatus: inProgress,
        },
        {
          date: story1Completed,
          fromStatus: inProgress,
          toStatus: done,
        },
      ],
    });

    const story2 = buildIssue({
      parentKey: epic.key,
      transitions: [
        {
          date: story2Started,
          fromStatus: backlog,
          toStatus: inProgress,
        },
        {
          date: story2Completed,
          fromStatus: inProgress,
          toStatus: done,
        },
      ],
    });

    it("computes epic cycle time metrics based on stories", () => {
      const [result] = getFlowMetrics(
        [epic, story1, story2],
        false,
        orderedStatuses,
      );

      expect(result.metrics).toEqual({
        started: story1Started,
        completed: story2Completed,
        cycleTime: 1.25,
      });
    });

    it("does not compute epic completed dates when the epic is not done", () => {
      const inProgressEpic = {
        ...epic,
        statusCategory: StatusCategory.InProgress,
      };

      const [result] = getFlowMetrics(
        [inProgressEpic, story1, story2],
        false,
        orderedStatuses,
      );

      expect(result.metrics).toEqual({
        started: story1Started,
        completed: undefined,
        cycleTime: undefined,
      });
    });
  });
});
