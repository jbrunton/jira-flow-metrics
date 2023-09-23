import { CalendarOutlined, DownOutlined } from "@ant-design/icons"
import { Button, Dropdown, Form, Space } from "antd"
import { DatePicker, RangeType } from "./date-picker"
import { addDays, addMonths, addWeeks, addYears, startOfMonth, startOfWeek } from "date-fns";
import { useState } from "react";

export type DateSelectorProps = {
  dates: RangeType;
  onChange: (dates: RangeType) => void;
};

export const DateSelector: React.FC<DateSelectorProps> = ({ dates, onChange }) => {
  const [{ items, ranges }] = useState(() => getDateRanges());
  return (
    <Space.Compact>
      <Form.Item noStyle>
        <Dropdown menu={{
          items, onClick: (info) => {
            const range = ranges[info.key]
            onChange(range);
          }
        }}>
          <Button icon={<CalendarOutlined />}>
            <DownOutlined />
          </Button>
        </Dropdown>
      </Form.Item>
      <Form.Item>
        <DatePicker.RangePicker suffixIcon={false}
          style={{ width: '100%' }}
          allowClear={false}
          value={dates}
          onChange={onChange}
        />
      </Form.Item>
    </Space.Compact>
  )
}

type DateRangeOption = {
  label: string;
  key: string;
  range: [Date, Date];
};

type DateRangeOptionGroup = {
  label: string;
  key: string;
  children: DateRangeOption[];
};

type DateRangeMenuOptions = {
  items: DateRangeOptionGroup[];
  ranges: {
    [key: string]: [Date, Date];
  }
}

const getRelativeDateRange = (
  count: number,
  unit: "day" | "year",
  now: Date
): DateRangeOption => {
  const start = unit === "day" ? addDays(now, -count) : addYears(now, -count);
  const label = `Last ${count} ${count === 1 ? unit : `${unit}s`}`;
  return {
    label,
    key: `relative_${count}_${unit}`,
    range: [start, now],
  };
};

const getCalendarRange = (
  prevCount: number,
  unit: "week" | "month",
  now: Date
): DateRangeOption => {
  const startOfUnit = unit === "week" ? startOfWeek(now) : startOfMonth(now);
  const addUnits = unit === "week" ? addWeeks : addMonths;
  const range: [Date, Date] =
    prevCount === 0
      ? [startOfUnit, now]
      : [addUnits(startOfUnit, -prevCount), startOfUnit];
  const label =
    prevCount === 0
      ? `This ${unit}`
      : prevCount === 1
        ? `Last ${unit}`
        : `Last ${prevCount} ${unit}s`;
  return {
    label,
    key: `calendar_${prevCount}_${unit}`,
    range,
  };
};

const getDateRanges = (): DateRangeMenuOptions => {
  const now = new Date();

  const relativeItems = [
    ...[7, 14, 30, 90, 80].map((count) =>
      getRelativeDateRange(count, "day", now)
    ),
    ...[1, 2].map((count) => getRelativeDateRange(count, "year", now)),
  ];

  const calendarWeekItems = [
    ...[0, 1, 2, 4, 8].map((prevWeeks) =>
      getCalendarRange(prevWeeks, "week", now)
    ),
  ];

  const calendarMonthItems = [
    ...[0, 1, 3, 6, 12, 24].map((prevMonths) =>
      getCalendarRange(prevMonths, "month", now)
    ),
  ];

  const items = [
    {
      label: "Relative",
      key: "relative",
      children: relativeItems,
    },
    {
      label: "Calendar weeks",
      key: "calendar_weeks",
      children: calendarWeekItems,
    },
    {
      label: "Calendar months",
      key: "calendar_months",
      children: calendarMonthItems,
    },
  ];

  const ranges = Object.fromEntries(
    [...relativeItems, ...calendarWeekItems, ...calendarMonthItems].map(item => [item.key, item.range])
  );

  return {
    items,
    ranges,
  }
};
