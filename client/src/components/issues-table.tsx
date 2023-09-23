import { Link } from "react-router-dom";
import { Issue } from "../data/issues";
import { Space, Table, Tag } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { formatDate, formatNumber } from "../lib/format";
import { compareAsc } from "date-fns";
import { ColumnType, ColumnsType, SortOrder } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { isNil, reject, uniq } from "rambda";

export type IssuesTableProps = {
  issues: Issue[];
}

export const IssuesTable: React.FC<IssuesTableProps> = ({ issues }) => {
  const categoryColors = {
    "To Do": "grey",
    "In Progress": "blue",
    Done: "green",
  };

  const [issueTypeFilters, setIssueTypeFilters] = useState<ColumnType<Issue>["filters"]>([]);
  const [statusFilters, setStatusFilters] = useState<ColumnType<Issue>["filters"]>([]);
  const [resolutionFilters, setResolutionFilters] = useState<ColumnType<Issue>["filters"]>([]);

  useEffect(() => {
    const issueTypes = uniq(issues.map(issue => issue.issueType));
    setIssueTypeFilters(makeFilters(issueTypes));

    const statuses = uniq(issues.map(issue => issue.status));
    setStatusFilters(makeFilters(statuses));

    const resolutions = uniq(issues.map(issue => issue.resolution));
    setResolutionFilters(makeFilters(resolutions));
  }, [issues]);

  const columns: ColumnsType<Issue> = [
    { title: 'Key', dataIndex: 'key', key: 'key' },
    { title: 'Summary', dataIndex: 'summary', key: 'summary' },
    {
      title: 'Issue Type', dataIndex: 'issueType', key: 'issueType',
      sorter: (a, b, sortOrder) => compareStrings(a.issueType, b.issueType, sortOrder),
      filters: issueTypeFilters,
      onFilter: (issueType, issue) => issue.issueType === issueType
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (status, issue) => {
        return (
          <Tag color={categoryColors[issue.statusCategory]}>
            {status}
          </Tag>
        );
      },
      sorter: (a, b, sortOrder) => compareStrings(a.status, b.status, sortOrder),
      filters: statusFilters,
      onFilter: (status, issue) => issue.status === status,
    },
    {
      title: 'Resolution', dataIndex: 'resolution', key: 'resolution',
      render: (resolution) => {
        return resolution === undefined ? null : <Tag color="green">{resolution}</Tag>
      },
      sorter: (a, b, sortOrder) => compareStrings(a.resolution, b.resolution, sortOrder),
      filters: resolutionFilters,
      onFilter: (resolution, issue) => issue.resolution === resolution,
    },
    {
      title: 'Started', dataIndex: 'started', key: 'started', render: (date) => {
        return formatDate(date);
      },
      sorter: (a, b, sortOrder) => compareDates(a.started, b.started, sortOrder),
    },
    {
      title: 'Completed', dataIndex: 'completed', key: 'completed', render: (date) => {
        return formatDate(date);
      },
      sorter: (a, b, sortOrder) => compareDates(a.completed, b.completed, sortOrder),
    },
    {
      title: 'Cycle Time', dataIndex: 'cycleTime', key: 'cycleTime', render: (cycleTime) => {
        return formatNumber(cycleTime);
      },
      defaultSortOrder: 'descend',
      sorter: (a, b, sortOrder) => compareNumbers(a.cycleTime, b.cycleTime, sortOrder),
    },
    { key: 'actions', render: (_, issue) => {
      return <Space>
        <Link to={issue.jiraUrl} target="_blank"><ExportOutlined /></Link>
      </Space>
    }}
  ]

  return (
    <Table
      dataSource={issues}
      size="small"
      columns={columns}
    />
  );
}

const makeFilters = (options: string[]): ColumnType<Issue>["filters"] => {
  return reject(isNil)(
    options.map(option => {
      if (option !== undefined) {
        return { text: option, value: option };
      }
    })
  );
}

const compareStrings = (left: string | undefined, right: string | undefined, sortOrder: SortOrder | undefined) => {
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
}

const compareDates = (left: Date | undefined, right: Date | undefined, sortOrder: SortOrder | undefined) => {
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
}

const compareNumbers = (left: number | undefined, right: number | undefined, sortOrder: SortOrder | undefined) => {
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
}
