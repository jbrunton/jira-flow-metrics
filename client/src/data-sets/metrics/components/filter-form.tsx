import { Col, Form, Row, Select, SelectProps } from "antd";
import { HierarchyLevel, Issue } from "../../../data/issues";
import { useEffect, useState } from "react";
import { RangeType } from "./date-picker";
import { isNil, map, pipe, reject, uniq } from "rambda";
import { DateSelector } from "./date-selector";
import { IssueFilter } from "../../../data/issues";

export type FilterFormProps = {
  issues: Issue[];
  filter: IssueFilter;
  onFilterChanged: (filter: IssueFilter) => void;
  additionalOptions?: React.ReactNode;
};

export const FilterForm: React.FC<FilterFormProps> = ({
  issues,
  filter: defaultFilter,
  onFilterChanged,
  additionalOptions,
}) => {
  const [hierarchyLevel, setHierarchyLevel] = useState<
    HierarchyLevel | undefined
  >(defaultFilter.hierarchyLevel);
  const [resolutions, setResolutions] = useState<SelectProps["options"]>(
    defaultFilter.resolutions?.map((resolution) => ({
      label: resolution,
      value: resolution,
    })),
  );

  useEffect(() => {
    if (!issues) {
      return;
    }

    const resolutions = pipe(
      map((issue: Issue) => issue.resolution),
      reject(isNil),
      uniq,
    )(issues);

    setResolutions(
      resolutions.map((resolution) => ({
        label: resolution,
        value: resolution,
      })),
    );
  }, [issues]);

  const [selectedResolutions, setSelectedResolutions] = useState<string[]>([]);

  const [dates, setDates] = useState<RangeType>(() => {
    return defaultFilter.dates ?? null;
  });

  useEffect(() => {
    onFilterChanged({
      hierarchyLevel,
      dates,
      resolutions: selectedResolutions,
    });
  }, [onFilterChanged, hierarchyLevel, dates, selectedResolutions]);

  return (
    <Form layout="vertical">
      <Row gutter={[8, 8]}>
        <Col span={6}>
          <Form.Item label="Dates">
            <DateSelector dates={dates} onChange={setDates} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="Hierarchy Level">
            <Select value={hierarchyLevel} onChange={setHierarchyLevel}>
              <Select.Option value="Story">Story</Select.Option>
              <Select.Option value="Epic">Epic</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="Resolution">
            <Select
              mode="multiple"
              allowClear={true}
              options={resolutions}
              onChange={setSelectedResolutions}
            />
          </Form.Item>
        </Col>
        {additionalOptions}
      </Row>
    </Form>
  );
};
