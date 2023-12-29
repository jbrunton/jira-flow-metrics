import { FC, Key, useEffect, useState } from "react";
import { HierarchyLevel, TransitionStatus } from "@jbrunton/flow-metrics";
import { Checkbox, Col, Form, Row, Table, Tag } from "antd";
import { ExpandableOptions } from "../../../../components/expandable-options";
import { WorkflowStage, useDatasetWorkflows } from "@data/issues";
import { flatten } from "rambda";

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
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>();
  const [selectedStages, setSelectedStages] = useState<string[]>();
  const [includeWaitTime, setIncludeWaitTime] = useState(false);

  const { data: datasetWorkflows } = useDatasetWorkflows(datasetId);

  useEffect(() => {
    if (!datasetWorkflows) return;

    const workflowStages = datasetWorkflows[HierarchyLevel.Story];

    setWorkflowStages(workflowStages);

    const defaultSelectedStages = workflowStages
      .filter((stage) => stage.selectByDefault)
      .map((stage) => stage.name);

    setSelectedStages(defaultSelectedStages);
  }, [datasetWorkflows, setWorkflowStages]);

  useEffect(() => {
    onOptionsChanged({
      includeWaitTime,
      statuses: flatten(
        datasetWorkflows?.[HierarchyLevel.Story]
          .filter((stage) => selectedStages?.includes(stage.name))
          .map((stage) => stage.statuses.map((status) => status.name)) ?? [],
      ),
    });
  }, [includeWaitTime, datasetWorkflows, selectedStages, onOptionsChanged]);

  return (
    <ExpandableOptions
      header={{
        title: "Dataset Options",
        options: [
          {
            label: "stages",
            value: selectedStages
              ? `Stages=${selectedStages}`
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
          <Col span={24}>
            <Form.Item label="Selected Stages">
              <Table
                size="small"
                rowKey="name"
                showHeader={false}
                rowSelection={{
                  selectedRowKeys: selectedStages,
                  onChange: (keys: Key[]) =>
                    setSelectedStages(keys as string[]),
                }}
                dataSource={workflowStages}
                pagination={false}
                columns={[
                  {
                    title: "Stage",
                    dataIndex: "name",
                    key: "name",
                  },
                  {
                    title: "Statuses",
                    dataIndex: "statuses",
                    key: "statuses",
                    render: (statuses: TransitionStatus[]) => (
                      <>
                        {statuses.map((status) => (
                          <Tag
                            bordered={true}
                            key={status.name}
                            color="#f9f9f9"
                            style={{ color: "#999", borderColor: "#eee" }}
                          >
                            {status.name}
                          </Tag>
                        ))}
                      </>
                    ),
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
