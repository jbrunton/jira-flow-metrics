import { ReactElement } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Title, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ThroughputResult } from "../../../lib/throughput";
import { TimeUnit } from "../../../lib/intervals";
import { Issue } from "../../../data/issues";
// TODO: do we need all of these?
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, TimeScale, Tooltip);

type ThroughputChartProps = {
  result: ThroughputResult;
  timeUnit: TimeUnit;
  setSelectedIssues: (issues: Issue[]) => void;
};

export const ThroughputChart = ({ result, timeUnit, setSelectedIssues }: ThroughputChartProps): ReactElement => {
  const labels = result.map(({ date }) => date.toISOString());

  const data = {
    labels,
    datasets: [
      {
        label: "Throughput",
        data: result.map(({ count }) => count),
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const scales: ChartOptions<"line">["scales"] = {
    x: {
      type: "time",
      time: {
        unit: timeUnit,
      },
      position: "bottom",
    },
    y: {
      beginAtZero: true,
    },
  };

  const onClick: ChartOptions<"line">["onClick"] = (_, elements) => {
    console.info(elements);
    if (elements.length === 1) {
      const selectedIssues = elements.map((el) => result[el.index].issues)[0];
      console.info(selectedIssues)
      setSelectedIssues(selectedIssues);
    } else {
      setSelectedIssues([]);
    }
    // if (elements.length) {
    //   const selectedIssues = elements.map((el) => issues[el.index]);
    //   setSelectedIssues(selectedIssues);
    // }
  };

  const options: ChartOptions<"line"> = {
    onClick,
    scales
  };

  return <Line data={data} options={options} />
};
