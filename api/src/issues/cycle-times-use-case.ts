import { map, pipe, pluck, reverse, sort } from 'rambda';
import {
  HierarchyLevel,
  Issue,
  StatusCategory,
  Transition,
  isCompleted,
  isStarted,
} from './types';
import { compareAsc, compareDesc } from 'date-fns';

export class CycleTimesUseCase {
  exec(issues: Issue[]): Issue[] {
    const stories = issues.filter(
      (issue) => issue.hierarchyLevel === HierarchyLevel.Story,
    );
    const epics = issues.filter(
      (issue) => issue.hierarchyLevel === HierarchyLevel.Epic,
    );

    for (const story of stories) {
      story.started = getStartedDate(story.transitions);
      story.completed = getCompletedDate(story.transitions);
      story.cycleTime = getCycleTime(story.started, story.completed);
    }

    for (const epic of epics) {
      estimateEpicCycleTimes(epic, issues);
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

const estimateEpicCycleTimes = (epic: Issue, issues: Issue[]): Issue => {
  const children = issues.filter((child) => child.parentKey === epic.key);
  const startedChildren = children.filter(isStarted);
  const completedChildren = children.filter(isCompleted);

  const startedDates = pipe(
    pluck('started'),
    sort(compareAsc),
    map((x) => new Date(x)),
  )(startedChildren);
  const started = startedDates[0];

  const completedDates = pipe(
    pluck('completed'),
    sort(compareDesc),
    map((x) => new Date(x)),
  )(completedChildren);

  const completed =
    epic.statusCategory === StatusCategory.Done ? completedDates[0] : undefined;

  const cycleTime = getCycleTime(started, completed);

  return {
    ...epic,
    started,
    completed,
    cycleTime,
  };
};
