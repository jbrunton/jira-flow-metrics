import { Link, useParams } from "react-router-dom";
import { useIssues } from "../data/issues";
import { Space, Table, Tag } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { formatDate, formatNumber } from "../lib/format";
import { compareAsc } from "date-fns";
import { SortOrder } from "antd/es/table/interface";

export const IssuesIndexPage = () => {
  const { dataSetId } = useParams();
  const { data: issues } = useIssues(dataSetId);

  const categoryColors = {
    "To Do": "grey",
    "In Progress": "blue",
    Done: "green",
  };

  return (
    <Table
      dataSource={issues}
      size="small"
      columns={[
        { title: 'Key', dataIndex: 'key', key: 'keu' },
        { title: 'Summary', dataIndex: 'summary', key: 'summary' },
        { title: 'Issue Type', dataIndex: 'issueType', key: 'issueType' },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (status, issue) => {
          return <Tag color={categoryColors[issue.statusCategory]}>
            {status}
          </Tag>
        }},
        { title: 'Resolution', dataIndex: 'resolution', key: 'resolution', render: (resolution) => {
          return resolution === undefined ? null : <Tag color="green">{resolution}</Tag>
        }},
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
          sorter: (a, b, sortOrder) => compareCycleTimes(a.cycleTime, b.cycleTime, sortOrder),
        },
        { key: 'actions', render: (_, issue) => {
          return <Space>
            <Link to={issue.jiraUrl} target="_blank"><ExportOutlined /></Link>
          </Space>
        }}
      ]}
    />
  );
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

const compareCycleTimes = (left: number | undefined, right: number | undefined, sortOrder: SortOrder | undefined) => {
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
