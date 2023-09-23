import { ReactElement } from "react";
import { CompleteIssue } from "../../data/issues";
import { ChartOptions } from "chart.js";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Title } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { RangeType } from "./date-picker";
import { formatDate } from "../../lib/format";
import { compareAsc, startOfDay } from "date-fns";
import { sort, uniqBy } from "rambda";
// TODO: do we need all of these?
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, TimeScale, Tooltip);

type ScatterplotProps = {
  issues: CompleteIssue[];
  range: RangeType;
};

const Scatterplot = ({ issues, range }: ScatterplotProps): ReactElement => {
  const data = issues.map((issue) => ({
    // x: issue.metrics.completed,
    // y: issue.metrics.cycleTime,
    x: issue.completed,
    y: Math.max(issue.cycleTime, 0), // TODO: check the cycle time math
  }));

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
    plugins: {
      tooltip: {
        callbacks: {
          title: (ctx) => {
            const dates = ctx.map(({ dataIndex }) => startOfDay(issues[dataIndex].completed));
            const uniqDates = sort(compareAsc, uniqBy((date: Date) => date.getTime(), dates));

            if (uniqDates.length === 1) {
              return formatDate(uniqDates[0]);
            }

            return `${formatDate(uniqDates[0])}-${formatDate(uniqDates[1])}`;
          },
          label: (ctx) => {
            const issue = issues[ctx.dataIndex];
            return `${issue.key}: ${issue.cycleTime?.toFixed(1)}`;
          }
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
          unit: 'day'
        }
      },
    },
  };

  return <Scatter data={{ datasets }} options={options} />
};

export default Scatterplot;
