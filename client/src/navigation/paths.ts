import { generatePath } from "react-router-dom";
import { NavigationContext } from "./context";

const paths = {
  datasets: {
    index: "/datasets",
    root: "/datasets/:datasetId",
  },
  issues: {
    index: "/datasets/:datasetId/issues",
    details: "/datasets/:datasetId/issues/:issueKey",
  },
  reports: {
    scatterplot: "/datasets/:datasetId/reports/scatterplot",
    throughput: "/datasets/:datasetId/reports/throughput",
  },
};

export const datasetsIndexPath = () => paths.datasets.index;

export const datasetRootPath = (params: Pick<NavigationContext, "datasetId">) =>
  generatePath(paths.datasets.root, params);

export const issuesIndexPath = (
  params: Pick<NavigationContext, "datasetId">,
): string => generatePath(paths.issues.index, params);

export const issueDetailsPath = (
  params: Pick<NavigationContext, "datasetId" | "issueKey">,
): string => generatePath(paths.issues.details, params);

export const scatterplotPath = (
  params: Pick<NavigationContext, "datasetId">,
): string => generatePath(paths.reports.scatterplot, params);

export const throughputPath = (
  params: Pick<NavigationContext, "datasetId">,
): string => generatePath(paths.reports.throughput, params);
