import { range } from "rambda";
import { DateRange, Issue } from "../data/issues";
import { addDays, differenceInDays } from "date-fns";

export type CalculateWipParams = {
  issues: Issue[];
  range: DateRange;
};

export type WipResult = {
  date: Date;
  count: number;
  issues: Issue[];
}[];

export const calculateWip = ({
  issues,
  range: dateRange,
}: CalculateWipParams): WipResult => {
  if (!dateRange) {
    return [];
  }

  const dates = range(0, differenceInDays(dateRange[1], dateRange[0])).map(
    (index) => addDays(dateRange[0], index),
  );

  const result: WipResult = dates.map((date) => {
    const inProgress = issues.filter((issue) => {
      return (
        issue.metrics.started &&
        issue.metrics.started < date &&
        (!issue.metrics.completed || issue.metrics.completed > date)
      );
    });
    const count = inProgress.length;
    return {
      date,
      count,
      issues: inProgress,
    };
  });

  return result;
};
