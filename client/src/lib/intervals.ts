import {
  addDays,
  addMonths,
  addWeeks,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  max,
  min,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

export type Interval = {
  start: Date;
  end: Date;
};

export enum TimeUnit {
  Day = "day",
  Week = "week",
  Fortnight = "fortnight",
  Month = "month",
}

const startOf = (date: Date, unit: TimeUnit): Date => {
  switch (unit) {
    case TimeUnit.Day:
      return startOfDay(date);
    case TimeUnit.Week:
    case TimeUnit.Fortnight:
      return startOfWeek(date);
    case TimeUnit.Month:
      return startOfMonth(date);
  }
};

const endOf = (date: Date, start: Date, unit: TimeUnit): Date => {
  switch (unit) {
    case TimeUnit.Day:
      return endOfDay(date);
    case TimeUnit.Week:
      return endOfWeek(date);
    case TimeUnit.Fortnight:
      return endOfWeek(
        addWeeks(start, Math.ceil(differenceInWeeks(date, start) / 2) * 2),
      );
    case TimeUnit.Month:
      return endOfMonth(date);
  }
};

export const getOverlappingInterval = (
  interval: Interval,
  unit: TimeUnit,
): Interval => {
  const start = startOf(interval.start, unit);
  const end = endOf(interval.end, start, unit);
  return { start, end };
};

export const getIntersectingInterval = (
  interval1: Interval,
  interval2: Interval,
): Interval | undefined => {
  if (interval1.end < interval2.start) {
    return undefined;
  }

  if (interval2.end < interval1.start) {
    return undefined;
  }

  const start: Date = max([interval1.start, interval2.start]);
  const end: Date = min([interval1.end, interval2.end]);

  return { start, end };
};

export const addTime = (date: Date, count: number, unit: TimeUnit): Date => {
  switch (unit) {
    case TimeUnit.Day:
      return addDays(date, count);
    case TimeUnit.Week:
      return addWeeks(date, count);
    case TimeUnit.Fortnight:
      return addWeeks(date, count * 2);
    case TimeUnit.Month:
      return addMonths(date, count);
  }
};

export const difference = (
  dateLeft: Date,
  dateRight: Date,
  unit: TimeUnit,
): number => {
  switch (unit) {
    case TimeUnit.Day:
      return differenceInDays(dateLeft, dateRight);
    case TimeUnit.Week:
      return differenceInWeeks(dateLeft, dateRight);
    case TimeUnit.Fortnight:
      return differenceInWeeks(dateLeft, dateRight) / 2;
    case TimeUnit.Month:
      return differenceInMonths(dateLeft, dateRight);
  }
};

export const defaultDateRange = (): Interval => {
  const today = new Date();
  const defaultStart = startOfDay(subDays(today, 30));
  const defaultEnd = endOfDay(today);
  return { start: defaultStart, end: defaultEnd };
};
