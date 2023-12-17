import { isNil, map, path, pipe, reverse, sort, sum } from "rambda";
import {
  HierarchyLevel,
  Issue,
  IssueFlowMetrics,
  StatusCategory,
  Transition,
  isCompleted,
  isStarted,
} from "@entities/issues";
import { compareAsc, compareDesc } from "date-fns";
import { getDifferenceInDays } from "@lib/dates";

export class CycleTimesUseCase {
  exec(
    issues: Issue[],
    includeWaitTime: boolean,
    orderedStatuses: string[],
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
        orderedStatuses,
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
  orderedStatuses: string[],
  fromStatusIndex?: number,
): number => {
  return transitions.findIndex((transition) =>
    isNil(fromStatusIndex)
      ? transition.toStatus.category === StatusCategory.InProgress
      : orderedStatuses.indexOf(transition.toStatus.name) >= fromStatusIndex,
  );
};

const getCompletedDateIndex = (
  transitions: Array<Transition>,
  orderedStatuses: string[],
  toStatusIndex?: number,
): number => {
  const index = reverse(transitions).findIndex((transition) =>
    isNil(toStatusIndex)
      ? transition.toStatus.category === StatusCategory.Done &&
        transition.fromStatus.category !== StatusCategory.Done
      : orderedStatuses.indexOf(transition.toStatus.name) === toStatusIndex &&
        transition.fromStatus.name !== transition.toStatus.name,
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

  return getDifferenceInDays(completed, started);
};

const getStoryFlowMetrics = (
  story: Issue,
  includeWaitTime: boolean,
  orderedStatuses: string[],
  fromStatus?: string,
  toStatus?: string,
): IssueFlowMetrics => {
  const now = new Date();
  const fromStatusIndex = isNil(fromStatus)
    ? undefined
    : orderedStatuses.indexOf(fromStatus);
  const toStatusIndex = isNil(toStatus)
    ? undefined
    : orderedStatuses.indexOf(toStatus);
  const startedIndex = getStartedDateIndex(
    story.transitions,
    orderedStatuses,
    fromStatusIndex,
  );
  const completedIndex = getCompletedDateIndex(
    story.transitions,
    orderedStatuses,
    toStatusIndex,
  );

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

  const getCycleTime = (transitions: Transition[]) => {
    return sum(
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
  };

  if (completedIndex === -1) {
    // started but not yet completed
    const lastTransition = story.transitions[story.transitions.length - 1];
    const timeInLastTransition =
      lastTransition.toStatus.category === StatusCategory.InProgress ||
      includeWaitTime
        ? getDifferenceInDays(now, lastTransition.date)
        : 0;
    const cycleTime =
      timeInLastTransition +
      getCycleTime(story.transitions.slice(startedIndex));
    return {
      started: story.transitions[startedIndex].date,
      cycleTime,
    };
  }

  const transitions = story.transitions.slice(startedIndex, completedIndex + 1);
  const cycleTime = getCycleTime(transitions);

  const started = transitions[0].date;
  const completed = transitions[transitions.length - 1].date;

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
