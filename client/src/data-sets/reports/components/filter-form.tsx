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
  showDateSelector: boolean;
  showStatusFilter: boolean;
  showResolutionFilter: boolean;
  additionalOptions?: React.ReactNode;
};

export const FilterForm: React.FC<FilterFormProps> = ({
  issues,
  filter: defaultFilter,
  onFilterChanged,
  showDateSelector,
  showStatusFilter,
  showResolutionFilter,
  additionalOptions,
}) => {
  const [hierarchyLevel, setHierarchyLevel] = useState<
    HierarchyLevel | undefined
  >(defaultFilter.hierarchyLevel);

  const [resolutions, setResolutions] = useState<SelectProps["options"]>();
  const [statuses, setStatuses] = useState<SelectProps["options"]>([]);
  const [issueTypes, setIssueTypes] = useState<SelectProps["options"]>();

  useEffect(() => {
    if (!issues) {
      return;
    }

    setResolutions(makeFilterOptions(issues, "resolution"));
    setStatuses(makeFilterOptions(issues, "status"));
    setIssueTypes(makeFilterOptions(issues, "issueType"));
  }, [issues]);

  const [selectedResolutions, setSelectedResolutions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<string[]>([]);
  const [fromStatus, setFromStatus] = useState<string>();
  const [toStatus, setToStatus] = useState<string>();

  const [dates, setDates] = useState<RangeType>(() => {
    return defaultFilter.dates ?? null;
  });

  useEffect(() => {
    onFilterChanged({
      hierarchyLevel,
      dates,
      resolutions: selectedResolutions,
      statuses: selectedStatuses,
      issueTypes: selectedIssueTypes,
      fromStatus,
      toStatus,
    });
  }, [
    onFilterChanged,
    hierarchyLevel,
    dates,
    selectedResolutions,
    selectedStatuses,
    selectedIssueTypes,
    fromStatus,
    toStatus,
  ]);

  return (
    <Form layout="vertical">
      <Row gutter={[8, 8]}>
        {showDateSelector ? (
          <Col span={6}>
            <Form.Item label="Dates">
              <DateSelector dates={dates} onChange={setDates} />
            </Form.Item>
          </Col>
        ) : null}
        <Col span={4}>
          <Form.Item label="Hierarchy Level">
            <Select value={hierarchyLevel} onChange={setHierarchyLevel}>
              <Select.Option value="Story">Story</Select.Option>
              <Select.Option value="Epic">Epic</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        {showResolutionFilter ? (
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
        ) : null}
        {showStatusFilter ? (
          <Col span={4}>
            <Form.Item label="Status">
              <Select
                mode="multiple"
                allowClear={true}
                options={statuses}
                onChange={setSelectedStatuses}
              />
            </Form.Item>
          </Col>
        ) : null}
        <Col span={4}>
          <Form.Item label="Issue Type">
            <Select
              mode="multiple"
              allowClear={true}
              options={issueTypes}
              onChange={setSelectedIssueTypes}
            />
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item label="From Status">
            <Select
              allowClear={true}
              options={statuses}
              onChange={setFromStatus}
            />
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item label="To Status">
            <Select
              allowClear={true}
              options={statuses}
              onChange={setToStatus}
            />
          </Form.Item>
        </Col>
        {additionalOptions}
      </Row>
    </Form>
  );
};

const makeFilterOptions = (
  issues: Issue[],
  property: keyof Issue,
): SelectProps["options"] => {
  const options = getUniqueValues(issues, property);
  return options?.map((option) => ({
    label: option,
    value: option,
  }));
};

const getUniqueValues = (issues: Issue[], property: keyof Issue): string[] => {
  return pipe(
    map((issue: Issue) => issue[property]),
    reject(isNil),
    uniq,
  )(issues);
};
