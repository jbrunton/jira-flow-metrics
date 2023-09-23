import { Card, Descriptions, Tag, Timeline } from "antd";
import { ReactElement } from "react";
import { Issue, IssueStatus } from "../../../data/issues";
import { formatTime } from "../../../lib/format";

const categoryColors = {
  "To Do": "grey",
  "In Progress": "blue",
  Done: "green",
};

export const IssueDetails = ({ issue }: { issue: Issue }): ReactElement => {
  const currentStatus: IssueStatus = {
    name: issue.status,
    category: issue.statusCategory,
  };
  const createdStatus: IssueStatus = issue.transitions.length
    ? issue.transitions[0].fromStatus
    : currentStatus;

  return (
    <>
      <h2>
        {issue.key} – {issue.summary}
      </h2>
      <Card title="Summary" bordered={false} size="small">
        <Descriptions
          column={1}
          key={issue.key}
          colon={false}
          size="small"
          labelStyle={{ width: "35%", fontWeight: 500 }}
        >
          <Descriptions.Item label="Issue Type">
            {issue.issueType}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={categoryColors[currentStatus.category]}>
              {currentStatus.name}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Resolution">
            {issue.resolution}
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {formatTime(issue.created)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Flow Metrics" bordered={false} size="small">
        <Descriptions
          column={1}
          key={issue.key}
          size="small"
          colon={false}
          labelStyle={{ width: "35%", fontWeight: 500 }}
        >
          <Descriptions.Item label="Started">
            {formatTime(issue.started)}
          </Descriptions.Item>
          <Descriptions.Item label="Completed">
            {formatTime(issue.completed)}
          </Descriptions.Item>
          <Descriptions.Item label="Cycle Time">
            {issue.cycleTime?.toFixed(1)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Transitions" bordered={false} size="small">
        <Timeline mode="left">
          <Timeline.Item
            label={formatTime(issue.created)}
            color={categoryColors[createdStatus.category]}
          >
            Created ({createdStatus.name})
          </Timeline.Item>
          {issue.transitions.map((transition, index) => (
            <Timeline.Item
              key={index}
              label={formatTime(transition.date)}
              color={categoryColors[transition.toStatus.category]}
            >
              {transition.toStatus.name}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </>
  );
};

export default IssueDetails;
