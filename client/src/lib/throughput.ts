import { range } from "rambda";
import { CompletedIssue } from "../data/issues";
import {
  Interval,
  TimeUnit,
  addTime,
  difference,
  endOf,
  startOf,
} from "./intervals";

export type CalculateThroughputParams = {
  issues: CompletedIssue[];
  interval: Interval;
  timeUnit: TimeUnit;
};

export type ThroughputResult = {
  date: Date;
  count: number;
  issues: CompletedIssue[];
}[];

export const calculateThroughput = ({
  issues,
  interval,
  timeUnit,
}: CalculateThroughputParams): ThroughputResult => {
  const start = startOf(interval.start, timeUnit);
  const end = endOf(interval.end, timeUnit);

  const intervals = range(0, difference(end, start, timeUnit) + 1).map(
    (index) => ({
      start: addTime(start, index, timeUnit),
      end: addTime(start, index + 1, timeUnit),
    }),
  );

  const result = intervals.map(({ start, end }) => {
    const intervalIssues = issues.filter(
      (issue) => start <= issue.completed && issue.completed < end,
    );

    return {
      date: start,
      count: intervalIssues.length,
      issues: intervalIssues,
    };
  });

  return result;
};
