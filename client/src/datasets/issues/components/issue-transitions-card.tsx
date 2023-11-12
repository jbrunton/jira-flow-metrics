import { Card, Timeline } from "antd";
import { formatTime } from "../../../lib/format";
import { categoryColors } from "./status-colors";
import { Issue, IssueStatus } from "../../../data/issues";

export type IssueTransitionsCardProps = {
  issue: Issue;
};

export const IssueTransitionsCard: React.FC<IssueTransitionsCardProps> = ({
  issue,
}) => {
  const currentStatus: IssueStatus = {
    name: issue.status,
    category: issue.statusCategory,
  };
  const createdStatus: IssueStatus = issue.transitions.length
    ? issue.transitions[0].fromStatus
    : currentStatus;

  return (
    <Card title="Transitions" size="small">
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
  );
};
