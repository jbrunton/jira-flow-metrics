import { ReactElement } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Title, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ThroughputResult } from "../../../lib/throughput";
import { TimeUnit } from "../../../lib/intervals";
// TODO: do we need all of these?
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, TimeScale, Tooltip);

type ThroughputChartProps = {
  result: ThroughputResult;
  timeUnit: TimeUnit;
};

export const ThroughputChart = ({ result, timeUnit }: ThroughputChartProps): ReactElement => {
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

  const options: ChartOptions<"line"> = {
    scales
  };

  return <Line data={data} options={options} />
};
