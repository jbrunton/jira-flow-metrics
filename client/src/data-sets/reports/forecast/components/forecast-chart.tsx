import { Bar } from "react-chartjs-2";
import {
  SummaryRow,
  getColorForPercentile,
} from "../../../../lib/simulation/run";
import { ChartData, ChartOptions } from "chart.js";

export type ForecastChartProps = {
  summary: SummaryRow[];
};

export const ForecastChart: React.FC<ForecastChartProps> = ({ summary }) => {
  const labels = summary.map(({ date }) => date.toISOString());

  const data: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        data: summary.map(({ count }) => count),
        backgroundColor: summary.map((row) =>
          getColorForPercentile(row.endPercentile),
        ),
        borderColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const scales: ChartOptions<"bar">["scales"] = {
    x: {
      type: "time",
      time: {
        unit: "day",
      },
      position: "bottom",
    },
    y: {
      beginAtZero: true,
    },
  };

  const options: ChartOptions<"bar"> = {
    scales,
    plugins: {
      tooltip: {
        callbacks: {
          title: () => {
            return [];
          },
          label: (ctx) => {
            return summary[ctx.dataIndex].tooltip;
          },
        },
        displayColors: false,
      },
    },
  };

  return <Bar data={data} options={options} />;
};
