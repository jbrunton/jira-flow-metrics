import { FC, useEffect, useState } from "react";
import { HierarchyLevel, Issue } from "@entities/issues";
import { Button, Col, Form, Row, Select, SelectProps, Space, Tag } from "antd";
import { DateSelector } from "../date-selector";
import { flatten, isNil, map, pipe, reject, uniq } from "rambda";
import { useFilterContext } from "../../../../filter/context";
import { Interval, defaultDateRange } from "@lib/intervals";
import {
  ExpandableOptions,
  ExpandableOptionsHeader,
} from "../../../../components/expandable-options";
import { formatDate } from "@lib/format";
import { IssueFilter, LabelFilterType } from "@data/issues";

export type FilterOptions = {
  hierarchyLevel?: HierarchyLevel;
  dates?: Interval;
  resolutions?: string[];
  statuses?: string[];
  issueTypes?: string[];
};

type FilterOptionsProps = {
  issues?: Issue[];
  filteredIssuesCount?: number;

  showDateSelector: boolean;
  showResolutionFilter: boolean;
  showStatusFilter: boolean;
  clearHierarchyLevelByDefault?: boolean;
};

export const FilterOptionsForm: FC<FilterOptionsProps> = ({
  issues,
  filteredIssuesCount,
  showDateSelector,
  showResolutionFilter,
  showStatusFilter,
  clearHierarchyLevelByDefault,
}) => {
  const { filter: initialFilter, setFilter } = useFilterContext();

  const defaultFilter: Required<
    Omit<IssueFilter, "hierarchyLevel" | "dates" | "fromStatus" | "toStatus">
  > &
    Pick<IssueFilter, "hierarchyLevel" | "dates"> = {
    hierarchyLevel: clearHierarchyLevelByDefault
      ? undefined
      : initialFilter.hierarchyLevel,
    resolutions: showResolutionFilter ? initialFilter.resolutions ?? [] : [],
    statuses: showStatusFilter ? initialFilter.statuses ?? [] : [],
    issueTypes: initialFilter.issueTypes ?? [],
    assignees: initialFilter.assignees ?? [],
    dates: showDateSelector
      ? initialFilter.dates ?? defaultDateRange()
      : undefined,
  };

  const clearFilter = () => {
    setHierarchyLevel(defaultFilter.hierarchyLevel);
    setSelectedResolutions(defaultFilter.resolutions);
    setSelectedStatuses(defaultFilter.statuses);
    setSelectedIssueTypes(defaultFilter.issueTypes);
    setSelectedAssignees(defaultFilter.assignees);
  };

  const [resolutions, setResolutions] = useState<SelectProps["options"]>();
  const [statuses, setStatuses] = useState<SelectProps["options"]>();
  const [components, setComponents] = useState<SelectProps["options"]>();
  const [issueTypes, setIssueTypes] = useState<SelectProps["options"]>();
  const [assignees, setAssignees] = useState<SelectProps["options"]>();
  const [labels, setLabels] = useState<SelectProps["options"]>();

  const [hierarchyLevel, setHierarchyLevel] = useState<
    HierarchyLevel | undefined
  >(defaultFilter.hierarchyLevel);

  useEffect(() => {
    if (!issues) {
      return;
    }

    const filteredIssues = issues.filter((issue) =>
      hierarchyLevel ? issue.hierarchyLevel === hierarchyLevel : true,
    );

    setResolutions(makeFilterOptions(filteredIssues, "resolution"));
    setIssueTypes(makeFilterOptions(filteredIssues, "issueType"));
    setStatuses(makeFilterOptions(filteredIssues, "status"));
    setAssignees(makeFilterOptions(filteredIssues, "assignee"));
    setLabels(makeLabelOptions(filteredIssues));
    setComponents(makeComponentOptions(filteredIssues));
  }, [issues, hierarchyLevel, setResolutions, setIssueTypes, setStatuses]);

  const [selectedResolutions, setSelectedResolutions] = useState<string[]>(
    defaultFilter.resolutions,
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    defaultFilter.statuses,
  );
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<string[]>(
    defaultFilter.issueTypes,
  );
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    defaultFilter.assignees,
  );

  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [labelFilterType, setLabelFilterType] = useState<LabelFilterType>(
    LabelFilterType.Include,
  );

  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  const [dates, setDates] = useState<Interval | undefined>(defaultFilter.dates);

  useEffect(() => {
    setFilter({
      dates,
      resolutions: selectedResolutions,
      statuses: selectedStatuses,
      issueTypes: selectedIssueTypes,
      assignees: selectedAssignees,
      labels: selectedLabels,
      components: selectedComponents,
      labelFilterType: labelFilterType,
      hierarchyLevel,
    });
  }, [
    setFilter,
    dates,
    selectedResolutions,
    selectedStatuses,
    selectedIssueTypes,
    selectedAssignees,
    selectedLabels,
    selectedComponents,
    labelFilterType,
    hierarchyLevel,
  ]);
  const options: ExpandableOptionsHeader["options"][number][] = [];

  if (dates) {
    options.push({
      label: "Dates",
      value: `${formatDate(dates.start)}-${formatDate(dates.end)}`,
    });
  }
  if (hierarchyLevel) {
    options.push({ label: "Hierarchy level", value: hierarchyLevel });
  }
  if (selectedResolutions.length) {
    options.push({ label: "Resolutions", value: selectedResolutions.join() });
  }
  if (selectedStatuses.length) {
    options.push({ label: "Statuses", value: selectedStatuses.join() });
  }
  if (selectedIssueTypes.length) {
    options.push({ label: "Issue types", value: selectedIssueTypes.join() });
  }
  if (selectedAssignees.length) {
    options.push({ label: "Assignees", value: selectedAssignees.join() });
  }
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

  const ClearFiltersButton = () => (
    <Button
      type="text"
      size="small"
      onClick={(e) => {
        clearFilter();
        e.stopPropagation();
      }}
    >
      Clear All
    </Button>
  );

  return (
    <ExpandableOptions
      header={{ title: "Filter Options", options }}
      extra={
        <Space>
          {options.length ? <ClearFiltersButton /> : null}
          <Tag>{filteredIssuesCount} issues</Tag>
        </Space>
      }
    >
      <Form layout="vertical">
        <Row gutter={[8, 8]}>
          {showDateSelector ? (
            <Col span={8}>
              <Form.Item label="Dates">
                <DateSelector dates={dates} onChange={setDates} />
              </Form.Item>
            </Col>
          ) : null}
          <Col span={4}>
            <Form.Item label="Hierarchy Level">
              <Select
                allowClear={true}
                value={hierarchyLevel}
                onChange={setHierarchyLevel}
              >
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
                  value={selectedResolutions}
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
                  value={selectedStatuses}
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
                value={selectedIssueTypes}
                onChange={setSelectedIssueTypes}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Assignees">
              <Select
                mode="multiple"
                allowClear={true}
                options={assignees}
                value={selectedAssignees}
                onChange={setSelectedAssignees}
              />
            </Form.Item>
          </Col>
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

const makeLabelOptions = (issues: Issue[]): SelectProps["options"] => {
  const options: string[] = uniq(flatten(issues.map((issue) => issue.labels)));
  return options?.map((option) => ({
    label: option,
    value: option,
  }));
};

const makeComponentOptions = (issues: Issue[]): SelectProps["options"] => {
  const options: string[] = uniq(
    flatten(issues.map((issue) => issue.components)),
  );
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
