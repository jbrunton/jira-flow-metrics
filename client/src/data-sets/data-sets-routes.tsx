import { Link, Navigate, Route } from "react-router-dom";
import { BreadcrumbHandle } from "../navigation/breadcrumbs";
import { DataSetsIndexPage } from "./index/data-sets-index-page";
import { IssuesIndexPage } from "./issues/issues-index-page";
import { ScatterplotPage } from "./reports/scatterplot-page";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { NavigationContext } from "../navigation/context";
import { ThroughputPage } from "./reports/throughput-page";
import { IssueDetailsPage } from "./issues/issue-details-page";

const dataSetsHandle: BreadcrumbHandle = {
  crumb({ dataSet }) {
    if (dataSet) {
      return { title: <Link to="/datasets">Data Sets</Link> };
    } else {
      return { title: "Data Sets" };
    }
  },
};

const dataSetHandle: BreadcrumbHandle = {
  crumb({ dataSet, dataSets }) {
    if (!dataSets) {
      return { title: "Loading" };
    }

    const items = dataSets?.map((dataSet) => ({
      key: dataSet.id,
      label: <Link to={`/datasets/${dataSet.id}`}>{dataSet.name}</Link>,
    }));

    const selectedKeys = dataSet ? [dataSet.id] : [];

    return { title: dataSet?.name, menu: { items, selectedKeys } };
  },
};

export const dataSetRoutes = (
  <Route path="/datasets" handle={dataSetsHandle}>
    <Route index element={<DataSetsIndexPage />} />
    <Route path=":dataSetId" handle={dataSetHandle}>
      <Route
        path="issues"
        handle={{
          crumb: ({ dataSetId }: NavigationContext) => ({
            title: <Link to={`/datasets/${dataSetId}/issues`}>Issues</Link>,
          }),
        }}
      >
        <Route index element={<IssuesIndexPage />} />
        <Route
          path=":issueKey"
          element={<IssueDetailsPage />}
          handle={{
            crumb: ({ issueKey }: NavigationContext) => ({ title: issueKey }),
          }}
        />
      </Route>
      <Route path="reports" handle={{ crumb: () => ({ title: "Reports" }) }}>
        <Route
          path="scatterplot"
          element={<ScatterplotPage />}
          handle={{
            crumb: ({ dataSet }: NavigationContext) =>
              reportsCrumb(dataSet?.id, "scatterplot"),
          }}
        />
        <Route
          path="throughput"
          element={<ThroughputPage />}
          handle={{
            crumb: ({ dataSet }: NavigationContext) =>
              reportsCrumb(dataSet?.id, "throughput"),
          }}
        />
        <Route index element={<Navigate to="scatterplot" />} />
      </Route>
    </Route>
  </Route>
);

const reportsCrumb = (
  datasetId: string | undefined,
  reportKey: "scatterplot" | "throughput",
): ItemType => {
  const reports = [
    {
      key: "scatterplot",
      label: (
        <Link to={`/datasets/${datasetId}/reports/scatterplot`}>
          Scatterplot
        </Link>
      ),
    },
    {
      key: "throughput",
      label: (
        <Link to={`/datasets/${datasetId}/reports/throughput`}>Throughput</Link>
      ),
    },
  ];
  const currentReport = reports.find((report) => report.key === reportKey);
  return {
    title: currentReport?.label,
    menu: { items: reports, selectedKeys: [reportKey] },
  };
};
