import { HierarchyLevel, Status, StatusCategory } from "@entities/issues";
import { CycleTimesUseCase } from "./cycle-times-use-case";
import { buildIssue } from "@fixtures/factories/issue-factory";

describe("CycleTimesUseCase", () => {
  const cycleTimes = new CycleTimesUseCase();

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
            fromStatus: {
              name: "backlog",
              category: StatusCategory.ToDo,
            },
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

      const [result] = cycleTimes.exec([issue]);

      expect(result.metrics).toEqual({
        cycleTime: 0.8824751736111112,
        started: startedDate,
        completed: completedDate,
      });
    });

    it("uses the first started date when an issue is paused", () => {
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

      const [result] = cycleTimes.exec([issue]);

      expect(result.metrics).toEqual({
        started: firstStartedDate,
        completed: completedDate,
        cycleTime: 0.25,
      });
    });

    it("uses the last completed date when an issue is restarted", () => {
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

      const [result] = cycleTimes.exec([issue]);

      expect(result.metrics).toEqual({
        started: startedDate,
        completed: secondCompletedDate,
        cycleTime: 0.25,
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

      const [result] = cycleTimes.exec([issue]);

      expect(result.metrics).toEqual({
        started: startedDate,
        completed: devCompletedDate,
        cycleTime: 0.125,
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
      const [result] = cycleTimes.exec([epic, story1, story2]);

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

      const [result] = cycleTimes.exec([inProgressEpic, story1, story2]);

      expect(result.metrics).toEqual({
        started: story1Started,
        completed: undefined,
        cycleTime: undefined,
      });
    });
  });
});
