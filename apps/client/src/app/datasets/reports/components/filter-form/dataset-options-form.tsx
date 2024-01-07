import { FC, Key, useEffect, useState } from "react";
import { LabelFilterType, TransitionStatus } from "@jbrunton/flow-metrics";
import {
  Checkbox,
  Col,
  Form,
  Row,
  Select,
  SelectProps,
  Space,
  Table,
  Tag,
} from "antd";
import {
  ExpandableOptions,
  ExpandableOptionsHeader,
} from "../../../../components/expandable-options";
import { WorkflowStage } from "@data/issues";
import { flatten } from "rambda";
import { useDataset } from "@data/datasets";

export type DatasetOptions = {
  statuses?: string[];
  includeWaitTime: boolean;
  labels?: string[];
  components?: string[];
  labelFilterType?: LabelFilterType;
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

  const { data: dataset } = useDataset(datasetId);

  useEffect(() => {
    if (!dataset) return;

    const workflowStages = dataset.workflow;

    setWorkflowStages(workflowStages);

    if (!selectedStages) {
      const defaultSelectedStages = workflowStages
        .filter((stage) => stage.selectByDefault)
        .map((stage) => stage.name);
      setSelectedStages(defaultSelectedStages);
    }
  }, [dataset, setWorkflowStages, selectedStages, setSelectedStages]);

  const [components, setComponents] = useState<SelectProps["options"]>();
  const [labels, setLabels] = useState<SelectProps["options"]>();

  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [labelFilterType, setLabelFilterType] = useState<LabelFilterType>(
    LabelFilterType.Include,
  );

  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  useEffect(() => {
    onOptionsChanged({
      includeWaitTime,
      labels: selectedLabels,
      labelFilterType,
      components: selectedComponents,
      statuses: flatten(
        dataset?.workflow
          .filter((stage) => selectedStages?.includes(stage.name))
          .map((stage) => stage.statuses.map((status) => status.name)) ?? [],
      ),
    });
  }, [
    includeWaitTime,
    dataset,
    selectedStages,
    onOptionsChanged,
    selectedLabels,
    labelFilterType,
    selectedComponents,
  ]);

  useEffect(() => {
    setLabels(makeOptions(dataset?.labels));
    setComponents(makeOptions(dataset?.components));
  }, [dataset]);

  const options: ExpandableOptionsHeader["options"][number][] = [
    {
      label: "stages",
      value: selectedStages
        ? `Stages=${selectedStages}`
        : "StatusCategory=In Progress",
    },
    {
      value: `${includeWaitTime ? "Include" : "Exclude"} wait time`,
    },
  ];

  if (selectedLabels.length) {
    options.push({
      label:
        labelFilterType === LabelFilterType.Include
          ? "Include labels"
          : "Exclude labels",
      value: selectedLabels.join(),
    });
  }
  if (selectedComponents.length) {
    options.push({
      label: "Components",
      value: selectedComponents.join(),
    });
  }

  return (
    <ExpandableOptions
      header={{
        title: "Dataset Options",
        options,
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
        <Row gutter={[8, 8]}>
          <Col span={8}>
            <Form.Item label="Labels" style={{ width: "100%" }}>
              <Space.Compact style={{ width: "100%" }}>
                <Form.Item style={{ width: "25%" }}>
                  <Select
                    value={labelFilterType}
                    onChange={setLabelFilterType}
                    options={[
                      { value: "include", label: "Include" },
                      { value: "exclude", label: "Exclude" },
                    ]}
                  />
                </Form.Item>
                <Form.Item style={{ width: "75%" }}>
                  <Select
                    mode="multiple"
                    allowClear={true}
                    options={labels}
                    value={selectedLabels}
                    onChange={setSelectedLabels}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Components">
              <Select
                mode="multiple"
                allowClear={true}
                options={components}
                value={selectedComponents}
                onChange={setSelectedComponents}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ExpandableOptions>
  );
};

const makeOptions = (values?: string[]): SelectProps["options"] => {
  return values?.map((value) => ({
    label: value,
    value: value,
  }));
};
