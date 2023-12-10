import { Card, Descriptions } from "antd";
import { Issue } from "@entities/issues";
import { formatNumber, formatTime } from "../../../../lib/format";

export type IssueMetricsCardProps = {
  issue: Issue;
};

export const IssueMetricsCard: React.FC<IssueMetricsCardProps> = ({
  issue,
}) => {
  return (
    <Card title="Flow Metrics" size="small">
      <Descriptions
        column={1}
        key={issue.key}
        size="small"
        colon={false}
        labelStyle={{ width: "35%", fontWeight: 500 }}
      >
        <Descriptions.Item label="Started">
          {formatTime(issue.metrics.started)}
        </Descriptions.Item>
        <Descriptions.Item label="Completed">
          {formatTime(issue.metrics.completed)}
        </Descriptions.Item>
        <Descriptions.Item label="Cycle Time">
          {formatNumber(issue.metrics.cycleTime)} days
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
