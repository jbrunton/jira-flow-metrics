import { Link } from "react-router-dom";
import { Issue } from "../data/issues";
import { Table, Tag, Typography } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { formatDate, formatNumber } from "../lib/format";
import { compareAsc, differenceInMinutes } from "date-fns";
import { ColumnType, ColumnsType, SortOrder } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { isNil, reject, uniq } from "rambda";
import { useNavigationContext } from "../navigation/context";
import { issueDetailsPath } from "../navigation/paths";

export type IssuesTableProps = {
  issues: Issue[];
  parentEpic?: Issue;
  defaultSortField: "created" | "started" | "cycleTime";
};

export const IssuesTable: React.FC<IssuesTableProps> = ({
  issues,
  parentEpic,
  defaultSortField,
}) => {
  const { datasetId } = useNavigationContext();

  const categoryColors = {
    "To Do": "grey",
    "In Progress": "blue",
    Done: "green",
  };

  const [issueTypeFilters, setIssueTypeFilters] = useState<
    ColumnType<Issue>["filters"]
  >([]);
  const [statusFilters, setStatusFilters] = useState<
    ColumnType<Issue>["filters"]
  >([]);
  const [resolutionFilters, setResolutionFilters] = useState<
    ColumnType<Issue>["filters"]
  >([]);

  useEffect(() => {
    const issueTypes = uniq(issues.map((issue) => issue.issueType));
    setIssueTypeFilters(makeFilters(issueTypes));

    const statuses = uniq(issues.map((issue) => issue.status));
    setStatusFilters(makeFilters(statuses));

    const resolutions = uniq(issues.map((issue) => issue.resolution));
    setResolutionFilters(makeFilters(resolutions));
  }, [issues]);

  const columns: ColumnsType<Issue> = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      render: (issueKey) => (
        <Link
          style={{ whiteSpace: "nowrap" }}
          to={issueDetailsPath({ datasetId, issueKey })}
        >
          {issueKey}
        </Link>
      ),
    },
    {
      key: "open",
      render: (_, issue) => (
        <Link to={issue.externalUrl} target="_blank">
          <ExportOutlined />
        </Link>
      ),
    },
    {
      title: "Summary",
      key: "summary",
      dataIndex: "summary",
      render: (summary) => (
        <Typography.Text
          style={{ maxWidth: 300 }}
          ellipsis={{ tooltip: summary }}
        >
          {summary}
        </Typography.Text>
      ),
    },
    {
      title: "Issue Type",
      dataIndex: "issueType",
      key: "issueType",
      sorter: (a, b, sortOrder) =>
        compareStrings(a.issueType, b.issueType, sortOrder),
      filters: issueTypeFilters,
      onFilter: (issueType, issue) => issue.issueType === issueType,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, issue) => {
        return <Tag color={categoryColors[issue.statusCategory]}>{status}</Tag>;
      },
      sorter: (a, b, sortOrder) =>
        compareStrings(a.status, b.status, sortOrder),
      filters: statusFilters,
      onFilter: (status, issue) => issue.status === status,
    },
    {
      title: "Resolution",
      dataIndex: "resolution",
      key: "resolution",
      render: (resolution) => {
        return resolution === undefined ? null : (
          <Tag color="green">{resolution}</Tag>
        );
      },
      sorter: (a, b, sortOrder) =>
        compareStrings(a.resolution, b.resolution, sortOrder),
      filters: resolutionFilters,
      onFilter: (resolution, issue) => issue.resolution === resolution,
    },
    {
      title: "Created",
      dataIndex: ["created"],
      key: "created",
      defaultSortOrder: defaultSortField === "created" ? "descend" : undefined,
      render: (date) => {
        return formatDate(date);
      },
      sorter: (a, b, sortOrder) =>
        compareDates(a.created, b.created, sortOrder),
    },
    {
      title: "Started",
      dataIndex: ["metrics", "started"],
      key: "started",
      defaultSortOrder: defaultSortField === "started" ? "ascend" : undefined,
      render: (date) => {
        return formatDate(date);
      },
      sorter: (a, b, sortOrder) =>
        compareDates(a.metrics.started, b.metrics.started, sortOrder),
    },
    {
      title: "Completed",
      dataIndex: ["metrics", "completed"],
      key: "completed",
      render: (date) => {
        return formatDate(date);
      },
      sorter: (a, b, sortOrder) =>
        compareDates(a.metrics.completed, b.metrics.completed, sortOrder),
    },
    {
      title: "Cycle Time",
      dataIndex: ["metrics", "cycleTime"],
      key: "cycleTime",
      defaultSortOrder:
        defaultSortField === "cycleTime" ? "descend" : undefined,
      render: (cycleTime) => {
        return formatNumber(cycleTime);
      },
      sorter: (a, b, sortOrder) =>
        compareNumbers(a.metrics.cycleTime, b.metrics.cycleTime, sortOrder),
    },
  ];

  const IssueProgress = ({ issue }: { issue: Issue }) => {
    if (!parentEpic) return null;
    const parentStarted = parentEpic.metrics.started;
    const parentCompleted = parentEpic.metrics.completed;
    if (!parentStarted || !parentCompleted) return null;

    const issueStarted = issue.metrics.started;
    const issueCompleted = issue.metrics.completed;

    if (!issueStarted || !issueCompleted) return null;

    const totalTime = differenceInMinutes(parentCompleted, parentStarted);
    const startedTime = differenceInMinutes(issueStarted, parentStarted);
    const completedTime = differenceInMinutes(issueCompleted, parentStarted);
    const progressTime = differenceInMinutes(issueCompleted, issueStarted);

    const startedIndex = (startedTime / totalTime) * 100;
    const completedIndex = (completedTime / totalTime) * 100;
    const progressWidth = (progressTime / totalTime) * 100;

    return (
      <div
        style={{
          width: progressWidth,
          borderRadius: "10px",
          backgroundColor: "#1677ff",
          height: "10px",
          marginLeft: startedIndex,
          marginRight: completedIndex,
        }}
      />
    );
  };

  if (parentEpic) {
    columns.push({
      title: "Progress",
      key: "progress",
      render: (_, issue) => {
        return <IssueProgress issue={issue} />;
      },
    });
  }

  const [pageSize, setPageSize] = useState(20);

  return (
    <Table
      dataSource={issues}
      size="small"
      columns={columns}
      pagination={{
        pageSize,
        showSizeChanger: true,
        onChange: (_, pageSize) => setPageSize(pageSize),
      }}
    />
  );
};

const makeFilters = (options: string[]): ColumnType<Issue>["filters"] => {
  return reject(isNil)(
    options.map((option) => {
      if (option !== undefined) {
        return { text: option, value: option };
      }
    }),
  );
};

const compareStrings = (
  left: string | undefined,
  right: string | undefined,
  sortOrder: SortOrder | undefined,
) => {
  if (left && right) {
    return left.localeCompare(right);
  }

  if (left) {
    return sortOrder === "ascend" ? -1 : 1;
  }

  if (right) {
    return sortOrder === "ascend" ? 1 : -1;
  }

  return 0;
};

const compareDates = (
  left: Date | undefined,
  right: Date | undefined,
  sortOrder: SortOrder | undefined,
) => {
  if (left && right) {
    return compareAsc(left, right);
  }

  if (left) {
    return sortOrder === "ascend" ? -1 : 1;
  }

  if (right) {
    return sortOrder === "ascend" ? 1 : -1;
  }

  return 0;
};

const compareNumbers = (
  left: number | undefined,
  right: number | undefined,
  sortOrder: SortOrder | undefined,
) => {
  if (left !== undefined && right !== undefined) {
    return left - right;
  }

  if (left !== undefined) {
    return sortOrder === "ascend" ? -1 : 1;
  }

  if (right !== undefined) {
    return sortOrder === "ascend" ? 1 : -1;
  }

  return 0;
};
