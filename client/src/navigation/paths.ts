import { generatePath } from "react-router-dom";
import { NavigationContext } from "./context";

const paths = {
  datasets: {
    index: "/datasets",
    root: "/datasets/:dataSetId",
  },
  issues: {
    index: "/datasets/:dataSetId/issues",
    details: "/datasets/:dataSetId/issues/:issueKey",
  },
  reports: {
    scatterplot: "/datasets/:dataSetId/reports/scatterplot",
    throughput: "/datasets/:dataSetId/reports/throughput",
  },
};

export const datasetsIndexPath = () => paths.datasets.index;

export const datasetRootPath = (params: Pick<NavigationContext, "dataSetId">) =>
  generatePath(paths.datasets.root, params);

export const issuesIndexPath = (
  params: Pick<NavigationContext, "dataSetId">,
): string => generatePath(paths.issues.index, params);

export const issueDetailsPath = (
  params: Pick<NavigationContext, "dataSetId" | "issueKey">,
): string => generatePath(paths.issues.details, params);

export const scatterplotPath = (
  params: Pick<NavigationContext, "dataSetId">,
): string => generatePath(paths.reports.scatterplot, params);

export const throughputPath = (
  params: Pick<NavigationContext, "dataSetId">,
): string => generatePath(paths.reports.throughput, params);
