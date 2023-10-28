import { map, path, pipe, reverse, sort } from "rambda";
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

export class CycleTimesUseCase {
  exec(issues: Issue[]): Issue[] {
    const stories = issues.filter(
      (issue) => issue.hierarchyLevel === HierarchyLevel.Story,
    );

    const epics = issues.filter(
      (issue) => issue.hierarchyLevel === HierarchyLevel.Epic,
    );

    for (const story of stories) {
      story.metrics = getStoryFlowMetrics(story);
    }

    for (const epic of epics) {
      epic.metrics = estimateEpicFlowMetrics(epic, issues);
    }

    return [...epics, ...issues];
  }
}

const getStartedDate = (transitions: Array<Transition>): Date | undefined => {
  const startedTransition = transitions.find(
    (transition) => transition.toStatus.category === StatusCategory.InProgress,
  );

  return startedTransition?.date;
};

const getCompletedDate = (transitions: Array<Transition>): Date | undefined => {
  const lastTransition = reverse(transitions).find(
    (transition) =>
      transition.toStatus.category === StatusCategory.Done &&
      transition.fromStatus.category !== StatusCategory.Done,
  );

  return lastTransition?.date;
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

  return (completed.getTime() - started.getTime()) / (1_000 * 60 * 60 * 24);
};

const getStoryFlowMetrics = (story: Issue): IssueFlowMetrics => {
  const started = getStartedDate(story.transitions);
  const completed = getCompletedDate(story.transitions);
  const cycleTime = getCycleTime(started, completed);
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
