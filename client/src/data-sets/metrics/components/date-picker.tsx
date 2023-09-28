import { DatePicker as AntDatePicker } from "antd";
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";

export const DatePicker = AntDatePicker.generatePicker<Date>(
  dateFnsGenerateConfig,
);

export type RangeType = [Date | null, Date | null] | null;
