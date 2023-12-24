import { differenceInSeconds } from "date-fns";

const secondsInDay = 60 * 60 * 24;

export const getDifferenceInDays = (left: Date, right: Date): number =>
  differenceInSeconds(left, right) / secondsInDay;
