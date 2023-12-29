import { FC, Key, useEffect, useState } from "react";
import { HierarchyLevel, StatusCategory } from "@jbrunton/flow-metrics";
import { Checkbox, Col, Form, Row, SelectProps, Table, Tag } from "antd";
import { ExpandableOptions } from "../../../../components/expandable-options";
import { useDatasetStatuses } from "@data/issues";

export type DatasetOptions = {
  statuses?: string[];
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
  const [statusOptions, setStatusOptions] = useState<SelectProps["options"]>();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>();
  const [includeWaitTime, setIncludeWaitTime] = useState(false);

  const { data: datasetStatuses } = useDatasetStatuses(datasetId);

  useEffect(() => {
    if (!datasetStatuses) return;

    const statusOptions = datasetStatuses[HierarchyLevel.Story].map(
      (status) => ({
        label: status.name,
        value: status.name,
      }),
    );

    setStatusOptions(statusOptions);

    const defaultSelectedStatuses = datasetStatuses[HierarchyLevel.Story]
      .filter((status) => status.category === StatusCategory.InProgress)
      .map((status) => status.name);

    setSelectedStatuses(defaultSelectedStatuses);
  }, [datasetStatuses, setStatusOptions]);

  useEffect(() => {
    onOptionsChanged({
      includeWaitTime,
      statuses: selectedStatuses,
    });
  }, [includeWaitTime, selectedStatuses, onOptionsChanged]);

  return (
    <ExpandableOptions
      header={{
        title: "Dataset Options",
        options: [
          {
            label: "statuses",
            value: selectedStatuses
              ? `Statuses=${selectedStatuses}`
              : "StatusCategory=In Progress",
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
          <Col span={12}>
            <Form.Item label="Selected Statuses">
              <Table
                size="small"
                rowKey="value"
                showHeader={false}
                rowSelection={{
                  selectedRowKeys: selectedStatuses,
                  onChange: (keys: Key[]) =>
                    setSelectedStatuses(keys as string[]),
                }}
                dataSource={statusOptions}
                pagination={false}
                columns={[
                  {
                    title: "Status",
                    dataIndex: "value",
                    key: "status",
                  },
                ]}
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
