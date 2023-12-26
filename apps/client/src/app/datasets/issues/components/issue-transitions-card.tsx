import { Card, Timeline, Tooltip } from "antd";
import { formatNumber, formatTime } from "@jbrunton/flow-lib";
import { Issue } from "@jbrunton/flow-metrics";
import { categoryColors } from "../../../components/category-colors";

export type IssueTransitionsCardProps = {
  issue: Issue;
};

export const IssueTransitionsCard: React.FC<IssueTransitionsCardProps> = ({
  issue,
}) => {
  return (
    <Card title="Transitions" size="small">
      <Timeline mode="left">
        {issue.transitions.map((transition, index) => (
          <Timeline.Item
            key={index}
            label={formatTime(transition.date)}
            color={categoryColors[transition.toStatus.category]}
          >
            <Tooltip
              placement="right"
              title={`${formatNumber(transition.timeInStatus)} days`}
            >
              {index === 0
                ? `Created (${transition.toStatus.name})`
                : transition.toStatus.name}{" "}
            </Tooltip>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
};
