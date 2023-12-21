import { HierarchyLevel, Issue } from "@entities/issues";
import { useEffect, useState } from "react";
import { useFilterContext } from "../../../filter/context";
import { FilterOptionsForm } from "../components/filter-form/filter-options-form";
import { useDatasetContext } from "../../context";
import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  TimeSpentRow,
  timeSpentInPeriod,
} from "@usecases/time-spent/time-spent";
import { IssueExternalLink, IssueLink } from "../../../components/issue-links";
import { useNavigationContext } from "../../../navigation/context";
import { IssueResolution, IssueStatus } from "../../../components/issue-fields";
import { DateFilterType, filterIssues } from "@data/issues";
import { IssueDetailsDrawer } from "../scatterplot/components/issue-details-drawer";
import { ZoomInOutlined } from "@ant-design/icons";

export const TimeSpentPage = () => {
  const { datasetId } = useNavigationContext();
  const { issues } = useDatasetContext();

  const { filter } = useFilterContext();

  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    if (filter && issues) {
      const filteredIssues = filterIssues(issues, {
        ...filter,
        hierarchyLevel: HierarchyLevel.Story,
        dateFilterType: DateFilterType.Intersects,
      });
      setFilteredIssues([
        ...filteredIssues,
        ...issues.filter(
          (issue) => issue.hierarchyLevel === HierarchyLevel.Epic,
        ),
      ]);
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
      render: (_, { key, externalUrl }) =>
        externalUrl ? (
          <Space>
            <IssueExternalLink externalUrl={externalUrl} />
            <a
              onClick={() =>
                setSelectedIssue(
                  issues?.find((issue) => issue.key === key) ?? null,
                )
              }
            >
              <ZoomInOutlined />
            </a>
          </Space>
        ) : null,
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
    ? timeSpentInPeriod(filteredIssues, filter.dates)
    : [];

  return (
    <>
      <FilterOptionsForm
        issues={issues}
        filteredIssuesCount={filteredIssues.length}
        showDateSelector={true}
        showStatusFilter={false}
        showHierarchyFilter={false}
        clearHierarchyLevelByDefault={true}
        showResolutionFilter={true}
      />

      <Table
        rowClassName={(row) => `${row.rowType}-header`}
        columns={columns}
        size="small"
        dataSource={result}
        defaultExpandedRowKeys={["epics", "unassigned"]}
        indentSize={0}
      />

      <IssueDetailsDrawer
        selectedIssues={selectedIssue ? [selectedIssue] : []}
        onClose={() => setSelectedIssue(null)}
        open={selectedIssue !== null}
      />
    </>
  );
};
