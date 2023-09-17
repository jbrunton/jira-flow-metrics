import { Link, useParams } from "react-router-dom";
import { useIssues } from "../data/issues";
import { Space, Table, Tag } from "antd";
import { ExportOutlined } from "@ant-design/icons";

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
        { key: 'actions', render: (_, issue) => {
          return <Space>
            <Link to={issue.jiraUrl} target="_blank"><ExportOutlined /></Link>
          </Space>
        }}
      ]}
    />
  );
}
