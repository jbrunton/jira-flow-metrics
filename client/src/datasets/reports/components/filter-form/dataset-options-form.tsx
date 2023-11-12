import { FC, useEffect, useState } from "react";
import { HierarchyLevel, useDatasetStatuses } from "../../../../data/issues";
import { Col, Form, Row, Select, SelectProps, Tag, Typography } from "antd";
import { ExpandableOptions } from "../../../../components/expandable-options";

export type DatasetOptions = {
  // hierarchyLevel: HierarchyLevel;
  fromStatus?: string;
  toStatus?: string;
};

type DatasetOptionsProps = {
  datasetId?: string;
  onOptionsChanged: (options: DatasetOptions) => void;
};

export const DatasetOptionsForm: FC<DatasetOptionsProps> = ({
  datasetId,
  onOptionsChanged,
}) => {
  const [statuses, setStatuses] = useState<SelectProps["options"]>();
  const [fromStatus, setFromStatus] = useState<string>();
  const [toStatus, setToStatus] = useState<string>();

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
    onOptionsChanged({ fromStatus, toStatus });
  }, [fromStatus, toStatus, onOptionsChanged]);

  const title = (expanded: boolean) => (
    <span>
      Dataset options &nbsp;
      {expanded ? (
        <Typography.Text type="secondary">
          from:{" "}
          {fromStatus ? (
            <Tag>Status={fromStatus}</Tag>
          ) : (
            <Tag>StatusCategory=In Progress</Tag>
          )}
          to:{" "}
          {toStatus ? <Tag>{toStatus}</Tag> : <Tag>StatusCategory=Done</Tag>}
        </Typography.Text>
      ) : null}
    </span>
  );
  return (
    <ExpandableOptions title={title}>
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
      </Form>
    </ExpandableOptions>
  );
};
