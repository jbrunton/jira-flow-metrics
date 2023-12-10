export const categorizeWeekday = (dow: number): string => {
  return [6, 7].includes(dow) ? "weekend" : "weekday";
};
