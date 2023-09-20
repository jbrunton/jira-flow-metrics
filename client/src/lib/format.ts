import { format } from "date-fns";

export const formatNumber = (x?: number): string | undefined => {
  if (x !== undefined) {
    return x.toFixed(1);
  }
};

export const formatDate = (date?: Date): string | undefined => {
  if (date) {
    return format(date, 'd MMM yyyy');
  }
};
