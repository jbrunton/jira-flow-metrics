import { Tooltip, ChartOptions } from "chart.js";

import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { Issue } from "@entities/issues";
import { FC } from "react";
import { formatDate } from "@lib/format";
import { dropWhile, equals, flatten, sortBy, times, uniq } from "rambda";

const statusCategoryColors = {
  "To Do": "#ddd",
  "In Progress": "#c2d5f7",
  Done: "#d4e7cd",
};

type TimelineEvent = {
  label: string;
  summary: string;
  issueKey: string;
  status: string;
  category: Issue["statusCategory"];
  start: Date;
  end: Date;
  startTime: number;
  endTime: number;
};

Tooltip.positioners.custom = (_, eventPosition) => {
  return {
    x: eventPosition.x,
    y: eventPosition.y,
  };
};

const getOptions = (issues: Issue[], testData: TimelineEvent[]) => {
  const groups = uniq(testData.map((event) => event.issueKey));
  const labels = sortBy(
    (group) =>
      Math.min(
        ...testData
          .filter((e) => e.issueKey === group)
          .map((event) => event.start.getTime()),
      ),
    groups,
  );

  const datasets = testData.map((event) => {
    const datasetIndex = labels.indexOf(event.issueKey);

    const data: (null | [number, number, string])[] = times((index) => {
      if (index !== datasetIndex) {
        return null;
      }

      const tooltipLabel = `${event.status} (${formatDate(
        event.start,
      )}-${formatDate(event.end)})`;

      return [event.startTime, event.endTime, tooltipLabel];
    }, labels.length);

    return {
      summary: event.summary,
      data: data,
      skipNull: true,
      backgroundColor: statusCategoryColors[event.category],
      stack: event.issueKey,
      datalabels: {
        formatter: () => event.status,
      },
    };
  });

  const ellipsize = (text: string) =>
    text.length > 24 ? `${text.slice(0, 24)}…` : text;

  const data = {
    labels: labels.map((key) => {
      const issue = issues.find((i) => i.key === key);
      return [key, ellipsize(issue?.summary ?? "")];
    }),
    datasets: datasets,
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y" as const,
    plugins: {
      tooltip: {
        callbacks: {
          title: (items) => data.datasets[items[0].datasetIndex].summary,
          label: (item) =>
            data.datasets[item.datasetIndex].data[item.dataIndex]?.[2],
        },
        position: "custom",
      },
      legend: {
        display: false,
      },
      datalabels: {
        color: "black",
        anchor: "start",
        align: "right",
        display: (context) => {
          return context.dataset.data[context.dataIndex] !== null
            ? "auto"
            : false;
        },
      },
    },
    resizeDelay: 20,
    responsive: true,
    scales: {
      x: {
        min: Math.min(...testData.map((event) => event.start.getTime())),
        max: Math.max(...testData.map((event) => event.end.getTime())),
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
        type: "time",
        time: {
          unit: "day",
        },
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  return { options, data };
};

export type EpicTimelineProps = {
  issues: Issue[];
};

export const EpicTimeline: FC<EpicTimelineProps> = ({
  issues,
}: EpicTimelineProps) => {
  const events = issues.map((i) => {
    const transitions = dropWhile(
      (t) => t.toStatus.category !== "In Progress",
      i.transitions,
    ).reduce<Issue["transitions"]>((transitions, transition, index) => {
      const prevTransition = index > 0 ? transitions[index - 1] : undefined;
      if (
        prevTransition &&
        equals(prevTransition.toStatus, transition.toStatus)
      ) {
        // merge adjacent transitions to the same status
        prevTransition.until = transition.until;
        return transitions;
      } else {
        return [...transitions, transition];
      }
    }, []);
    const events = transitions.map((t, index) => {
      const prevTransition = index > 0 ? transitions[index - 1] : undefined;
      const startTime = prevTransition ? 0 : t.date.getTime();
      const endTime = prevTransition
        ? t.until.getTime() - t.date.getTime()
        : t.until.getTime();
      return {
        issueKey: i.key,
        summary: i.summary,
        start: t.date,
        end: t.until,
        startTime,
        endTime,
        status: t.toStatus.name,
        category: t.toStatus.category,
      };
    });
    return events;
  });
  const { options, data } = getOptions(issues, flatten(events));
  return <Bar options={options} data={data} />;
};
