import { DateFilterType, Issue, filterIssues } from "../../../data/issues";
import { useEffect, useState } from "react";
import { useFilterContext } from "../../../filter/context";
import { FilterOptionsForm } from "../components/filter-form/filter-options-form";
import { useDatasetContext } from "../../context";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { TimeSpentRow, timeSpentInPeriod } from "../../../lib/time-spent";
import { IssueExternalLink, IssueLink } from "../../../components/issue-links";
import { useNavigationContext } from "../../../navigation/context";
import { IssueResolution, IssueStatus } from "../../../components/issue-fields";

export const TimeSpentPage = () => {
  const { datasetId } = useNavigationContext();
  const { issues } = useDatasetContext();

  const { filter } = useFilterContext();

  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);

  useEffect(() => {
    if (filter && issues) {
      const filteredIssues = filterIssues(issues, {
        ...filter,
        hierarchyLevel: undefined,
        dateFilterType: DateFilterType.Intersects,
      });
      setFilteredIssues(filteredIssues);
    }
  }, [issues, filter, setFilteredIssues]);

  const columns: ColumnsType<TimeSpentRow> = [
    {
      key: "expand",
    },
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      render(_, row) {
        return row.rowType === "category" ? (
          row.summary
        ) : (
          <IssueLink issue={row} datasetId={datasetId} />
        );
      },
    },
    {
      key: "open",
      render: (_, { externalUrl }) => {
        return externalUrl ? (
          <IssueExternalLink externalUrl={externalUrl} />
        ) : null;
      },
    },
    {
      title: "Summary",
      key: "summary",
      render(_, row) {
        return row.rowType === "category" ? null : row.summary;
      },
    },
    {
      title: "Issue Type",
      key: "issueType",
      dataIndex: "issueType",
    },
    {
      title: "Status",
      key: "status",
      render: (_, { status, statusCategory }) =>
        status && statusCategory ? (
          <IssueStatus {...{ status, statusCategory }} />
        ) : null,
    },
    {
      title: "Resolution",
      key: "resolution",
      render: (_, row) => <IssueResolution {...row} />,
    },
    {
      title: "Issue Count",
      render(_, row) {
        return row.issueCount;
      },
    },
    {
      title: "Days In Period",
      render(_, row) {
        return row.timeInPeriod?.toFixed(0);
      },
    },
    {
      title: "(%)",
      render(_, row) {
        if (row.percentInPeriod !== undefined) {
          return `${row.percentInPeriod?.toFixed(0)}%`;
        }
      },
    },
  ];

  const result = filter.dates
    ? timeSpentInPeriod(filteredIssues, {
        start: filter.dates[0],
        end: filter.dates[1],
      })
    : [];

  return (
    <>
      <FilterOptionsForm
        issues={issues}
        filteredIssuesCount={filteredIssues.length}
        showDateSelector={true}
        showStatusFilter={false}
        showResolutionFilter={true}
      />

      <Table
        rowClassName={(row) => `${row.rowType}-header`}
        columns={columns}
        size="small"
        dataSource={result}
        defaultExpandedRowKeys={["epics", "unassigned"]}
      />
    </>
  );
};
