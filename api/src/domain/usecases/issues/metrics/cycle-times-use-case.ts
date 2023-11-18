import { map, path, pipe, reverse, sort, sum } from "rambda";
import {
  HierarchyLevel,
  Issue,
  IssueFlowMetrics,
  StatusCategory,
  Transition,
  isCompleted,
  isStarted,
} from "@entities/issues";
import { compareAsc, compareDesc, differenceInSeconds } from "date-fns";

const secondsInDay = 60 * 60 * 24;

export class CycleTimesUseCase {
  exec(
    issues: Issue[],
    includeWaitTime: boolean,
    fromStatus?: string,
    toStatus?: string,
  ): Issue[] {
    const stories = issues.filter(
      (issue) => issue.hierarchyLevel === HierarchyLevel.Story,
    );

    const epics = issues.filter(
      (issue) => issue.hierarchyLevel === HierarchyLevel.Epic,
    );

    const updatedStories = stories.map((story) => {
      const metrics = getStoryFlowMetrics(
        story,
        includeWaitTime,
        fromStatus,
        toStatus,
      );
      return {
        ...story,
        metrics,
      };
    });

    const updatedEpics = epics.map((epic) => {
      const metrics = estimateEpicFlowMetrics(epic, updatedStories);
      return {
        ...epic,
        metrics,
      };
    });

    return [...updatedEpics, ...updatedStories];
  }
}

const getStartedDateIndex = (
  transitions: Array<Transition>,
  fromStatus?: string,
): number => {
  return transitions.findIndex((transition) =>
    fromStatus
      ? transition.toStatus.name === fromStatus
      : transition.toStatus.category === StatusCategory.InProgress,
  );
};

const getCompletedDateIndex = (
  transitions: Array<Transition>,
  toStatus?: string,
): number => {
  const index = reverse(transitions).findIndex((transition) =>
    toStatus
      ? transition.toStatus.name === toStatus &&
        transition.fromStatus.name !== toStatus
      : transition.toStatus.category === StatusCategory.Done &&
        transition.fromStatus.category !== StatusCategory.Done,
  );

  return index === -1 ? -1 : transitions.length - index - 1;
};

export const getCycleTime = (
  started?: Date,
  completed?: Date,
): number | undefined => {
  if (!completed) {
    return undefined;
  }

  if (!started) {
    return 0;
  }

  return differenceInSeconds(completed, started) / secondsInDay;
};

const getStoryFlowMetrics = (
  story: Issue,
  includeWaitTime: boolean,
  fromStatus?: string,
  toStatus?: string,
): IssueFlowMetrics => {
  const startedIndex = getStartedDateIndex(story.transitions, fromStatus);
  const completedIndex = getCompletedDateIndex(story.transitions, toStatus);

  if (startedIndex === -1 && completedIndex === -1) {
    return {};
  }

  if (startedIndex === -1) {
    // moved straight to done
    return {
      completed: story.transitions[completedIndex].date,
      cycleTime: 0,
    };
  }

  if (completedIndex === -1) {
    // started but not yet completed
    return {
      started: story.transitions[startedIndex].date,
      cycleTime: undefined,
    };
  }

  const transitions = story.transitions.slice(startedIndex, completedIndex + 1);

  const started = transitions[0].date;
  const completed = transitions[transitions.length - 1].date;

  const cycleTime = sum(
    transitions.slice(0, transitions.length - 1).map((transition) => {
      if (includeWaitTime) {
        return transition.timeInStatus;
      } else {
        return transition.toStatus.category === StatusCategory.InProgress
          ? transition.timeInStatus
          : 0;
      }
    }),
  );

  return {
    started,
    completed,
    cycleTime,
  };
};

const estimateEpicFlowMetrics = (
  epic: Issue,
  issues: Issue[],
): IssueFlowMetrics => {
  const children = issues.filter((child) => child.parentKey === epic.key);
  const startedChildren = children.filter(isStarted);
  const completedChildren = children.filter(isCompleted);

  const startedDates = pipe(
    map(path(["metrics", "started"])),
    sort(compareAsc),
    map((x) => new Date(x)),
  )(startedChildren);
  const started = startedDates[0];

  const completedDates = pipe(
    map(path(["metrics", "completed"])),
    sort(compareDesc),
    map((x) => new Date(x)),
  )(completedChildren);

  const completed =
    epic.statusCategory === StatusCategory.Done ? completedDates[0] : undefined;

  const cycleTime = getCycleTime(started, completed);

  return {
    started,
    completed,
    cycleTime,
  };
};
