import { FC, useEffect, useState } from "react";
import { HierarchyLevel, useDatasetStatuses } from "../../../../data/issues";
import { Checkbox, Col, Form, Row, Select, SelectProps, Tag } from "antd";
import { ExpandableOptions } from "../../../../components/expandable-options";

export type DatasetOptions = {
  fromStatus?: string;
  toStatus?: string;
  includeWaitTime: boolean;
};

type DatasetOptionsProps = {
  datasetId?: string;
  onOptionsChanged: (options: DatasetOptions) => void;
  issuesCount?: number;
};

export const DatasetOptionsForm: FC<DatasetOptionsProps> = ({
  datasetId,
  onOptionsChanged,
  issuesCount,
}) => {
  const [statuses, setStatuses] = useState<SelectProps["options"]>();
  const [fromStatus, setFromStatus] = useState<string>();
  const [toStatus, setToStatus] = useState<string>();
  const [includeWaitTime, setIncludeWaitTime] = useState(false);

  const { data: datasetStatuses } = useDatasetStatuses(datasetId);

  useEffect(() => {
    if (!datasetStatuses) return;

    const statusOptions = datasetStatuses[HierarchyLevel.Story];
    const statuses = statusOptions.map((status) => ({
      label: status,
      value: status,
    }));

    setStatuses(statuses);
  }, [datasetStatuses, setStatuses]);

  useEffect(() => {
    onOptionsChanged({ fromStatus, toStatus, includeWaitTime });
  }, [fromStatus, toStatus, includeWaitTime, onOptionsChanged]);

  return (
    <ExpandableOptions
      header={{
        title: "Dataset Options",
        options: [
          {
            label: "from",
            value: fromStatus
              ? `Status=${fromStatus}`
              : "StatusCategory=In Progress",
          },
          {
            label: "to",
            value: toStatus ? `Status=${toStatus}` : "StatusCategory=Done",
          },
          {
            value: `${includeWaitTime ? "Include" : "Exclude"} wait time`,
          },
        ],
      }}
      extra={issuesCount ? <Tag>{issuesCount} issues</Tag> : null}
    >
      <Form layout="vertical">
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Form.Item label="From Status (Stories)">
              <Select
                allowClear={true}
                options={statuses}
                value={fromStatus}
                placeholder="StatusCategory=In Progress"
                onChange={setFromStatus}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="To Status (Stories)">
              <Select
                allowClear={true}
                options={statuses}
                value={toStatus}
                placeholder="StatusCategory=Done"
                onChange={setToStatus}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Checkbox
            checked={includeWaitTime}
            onChange={(e) => setIncludeWaitTime(e.target.checked)}
          >
            Include wait time
          </Checkbox>
        </Row>
      </Form>
    </ExpandableOptions>
  );
};
