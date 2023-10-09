import { ReactElement } from "react";
import { CompletedIssue, Issue } from "../../../data/issues";
import { ChartOptions } from "chart.js";
import { Scatter } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { RangeType } from "./date-picker";
import { formatDate } from "../../../lib/format";
import { compareAsc, startOfDay } from "date-fns";
import { sort, uniqBy } from "rambda";

type ScatterplotProps = {
  issues: CompletedIssue[];
  range: RangeType;
  setSelectedIssues: (issues: Issue[]) => void;
};

export const Scatterplot = ({
  issues,
  range,
  setSelectedIssues,
}: ScatterplotProps): ReactElement => {
  const data = issues.map((issue) => ({
    x: issue.metrics.completed,
    y: issue.metrics.cycleTime,
  }));

  const onClick: ChartOptions<"scatter">["onClick"] = (_, elements) => {
    if (elements.length) {
      const selectedIssues = elements.map((el) => issues[el.index]);
      setSelectedIssues(selectedIssues);
    }
  };

  const datasets = [
    {
      label: "Cycle Time",
      backgroundColor: "rgb(255, 99, 132)",
      data,
    },
  ];

  const minDate = range?.[0]?.toISOString();
  const maxDate = range?.[1]?.toISOString();

  const options: ChartOptions<"scatter"> = {
    onClick,
    plugins: {
      tooltip: {
        callbacks: {
          title: (ctx) => {
            const dates = ctx.map(({ dataIndex }) =>
              startOfDay(issues[dataIndex].metrics.completed),
            );
            const uniqDates = sort(
              compareAsc,
              uniqBy((date: Date) => date.getTime(), dates),
            );

            if (uniqDates.length === 1) {
              return formatDate(uniqDates[0]);
            }

            return `${formatDate(uniqDates[0])}-${formatDate(uniqDates[1])}`;
          },
          label: (ctx) => {
            const issue = issues[ctx.dataIndex];
            return `${issue.key}: ${issue.metrics.cycleTime?.toFixed(1)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        type: "time",
        min: minDate,
        max: maxDate,
        time: {
          unit: "day",
        },
      },
    },
  };

  return <Scatter data={{ datasets }} options={options} />;
};
