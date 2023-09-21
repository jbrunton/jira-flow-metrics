import { ReactElement } from "react";
import { CompleteIssue } from "../../data/issues";
import { ChartOptions } from "chart.js";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Title } from 'chart.js';
import 'chartjs-adapter-date-fns';
// TODO: do we need all of these?
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, TimeScale, Tooltip);

type ScatterplotProps = {
  issues: CompleteIssue[];
};

const Scatterplot = ({ issues }: ScatterplotProps): ReactElement => {
 // const filteredIssues = issues.filter(isCompleted);

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

  const options: ChartOptions<"scatter"> = {
    plugins: {
      tooltip: {
        callbacks: {
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
      },
    },
  };

  return <Scatter data={{ datasets }} options={options} />
};

export default Scatterplot;
