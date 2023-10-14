import { ReactElement } from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { ThroughputResult } from "../../../../lib/throughput";
import { TimeUnit } from "../../../../lib/intervals";
import { Issue } from "../../../../data/issues";

type ThroughputChartProps = {
  result: ThroughputResult;
  timeUnit: TimeUnit;
  setSelectedIssues: (issues: Issue[]) => void;
};

export const ThroughputChart = ({
  result,
  timeUnit,
  setSelectedIssues,
}: ThroughputChartProps): ReactElement => {
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
        unit: timeUnit === TimeUnit.Fortnight ? "week" : timeUnit,
      },
      position: "bottom",
    },
    y: {
      beginAtZero: true,
    },
  };

  const onClick: ChartOptions<"line">["onClick"] = (_, elements) => {
    if (elements.length === 1) {
      const selectedIssues = elements.map((el) => result[el.index].issues)[0];
      setSelectedIssues(selectedIssues);
    } else {
      setSelectedIssues([]);
    }
  };

  const options: ChartOptions<"line"> = {
    onClick,
    scales,
  };

  return <Line data={data} options={options} />;
};
