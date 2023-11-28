import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";
import {
  forecastPath,
  issuesIndexPath,
  scatterplotPath,
  throughputPath,
  wipPath,
} from "../../navigation/paths";

export const reportsCrumb = (
  datasetId: string | undefined,
  reportKey: "scatterplot" | "throughput" | "wip" | "forecast" | "issues",
): ItemType => {
  const reportOptions = datasetId
    ? [
        {
          key: "scatterplot",
          label: <Link to={scatterplotPath({ datasetId })}>Scatterplot</Link>,
        },
        {
          key: "throughput",
          label: <Link to={throughputPath({ datasetId })}>Throughput</Link>,
        },
        {
          key: "wip",
          label: <Link to={wipPath({ datasetId })}>WIP</Link>,
        },
        {
          key: "forecast",
          label: <Link to={forecastPath({ datasetId })}>Forecast</Link>,
        },
      ]
    : [];
  const issueOptions = datasetId
    ? [
        { type: "divider" },
        {
          key: "issues",
          label: <Link to={issuesIndexPath({ datasetId })}>Issues</Link>,
        },
      ]
    : [];

  const items = [...reportOptions, ...issueOptions];

  const currentReport = items.find((report) => report.key === reportKey);

  return {
    title: currentReport?.label,
    menu: { items, selectedKeys: [reportKey] },
  };
};
