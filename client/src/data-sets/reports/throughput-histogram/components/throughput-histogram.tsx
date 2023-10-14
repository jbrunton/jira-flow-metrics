import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

export type Bucket = {
  throughput: number;
  frequency: number;
};

export type ThroughputHistogramProps = {
  buckets: Bucket[];
};

export const ThroughputHistogram = ({
  buckets,
}: ThroughputHistogramProps): ReactElement => {
  const labels = buckets.map(({ throughput }) => throughput);

  const data = {
    labels,
    datasets: [
      {
        label: "Throughput",
        data: buckets.map(({ frequency }) => frequency),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const scales: ChartOptions<"line">["scales"] = {
    x: {
      type: "linear",
      // time: {
      //   unit: timeUnit === TimeUnit.Fortnight ? "week" : timeUnit,
      // },
      position: "bottom",
    },
    y: {
      beginAtZero: true,
    },
  };

  // const onClick: ChartOptions<"line">["onClick"] = (_, elements) => {
  //   if (elements.length === 1) {
  //     const selectedIssues = elements.map((el) => result[el.index].issues)[0];
  //     setSelectedIssues(selectedIssues);
  //   } else {
  //     setSelectedIssues([]);
  //   }
  // };

  const options: ChartOptions<"bar"> = {
    // onClick,
    scales,
  };

  return <Bar data={data} options={options} />;
};
