import { ReactElement } from "react";
import { Bar } from "react-chartjs-2";
import { ChartOptions, FontSpec } from "chart.js";
import { AnnotationOptions, LabelOptions } from "chartjs-plugin-annotation";
import { max } from "rambda";

export type Bucket = {
  throughput: number;
  frequency: number;
};

export type Percentile = { percentile: number; throughput: number };

export type ThroughputHistogramProps = {
  buckets: Bucket[];
  percentiles: Percentile[];
};

export const ThroughputHistogram = ({
  buckets,
  percentiles,
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

  // const annotation1: AnnotationOptions = {
  //   type: 'line',
  //   borderColor: 'black',
  //   borderWidth: 5,
  //   click: function({chart, element}) {
  //     console.log('Line annotation clicked');
  //   },
  //   label: {
  //     backgroundColor: 'red',
  //     content: 'Test Label',
  //     display: true
  //   },
  //   scaleID: 'x',
  //   value: 2
  // };

  const annotations = Object.fromEntries(
    percentiles.map((p) => {
      const name = `p${p.percentile}`;
      const options: AnnotationOptions = {
        type: "line",
        borderColor: "grey",
        borderWidth: 1,
        borderDash: [4, 4],
        // click: function({chart, element}) {
        //   console.log('Line annotation clicked');
        // },
        label: {
          backgroundColor: "#FFF",
          position: "start",
          content: p.percentile,
          display: true,
          color: "#666666",
        },
        scaleID: "x",
        value: p.throughput,
      };
      // const options: AnnotationOptions = {
      //   type: "line",
      //   xMin: p.throughput, //p.value,
      //   xMax: p.throughput, //p.value,
      //   borderColor: "grey", // p.color,
      //   borderWidth: 1,
      //   borderDash: [4, 4],
      //   drawTime: "afterDatasetsDraw",
      //   label: {
      //     //position: "end",
      //     content: 'foo',
      //     enabled: true,
      //     xPadding: -20,
      //     yPadding: -20,
      //     cornerRadius: 2,
      //     backgroundColor: "#F00",
      //     scaleID: 'x',
      //     color: "#666666",
      //     font: {
      //       style: "normal",
      //       size: 11,
      //     } as FontSpec,
      //   } as LabelOptions,
      // };
      return [name, options];
    }),
  );

  const max = Math.max(...buckets.map((b) => b.frequency)) + 1;

  const scales: ChartOptions<"bar">["scales"] = {
    x: {
      type: "linear",
      position: "bottom",
    },
    y: {
      beginAtZero: true,
      max,
    },
  };

  const options: ChartOptions<"bar"> = {
    scales,
    plugins: {
      annotation: {
        annotations,
      },
    },
  };

  return <Bar data={data} options={options} />;
};
