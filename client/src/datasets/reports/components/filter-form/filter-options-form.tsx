import { FC, useEffect, useState } from "react";
import { DateRange, HierarchyLevel, Issue } from "../../../../data/issues";
import { Col, Form, Row, Select, SelectProps } from "antd";
import { RangeType } from "../date-picker";
import { DateSelector } from "../date-selector";
import { isNil, map, pipe, reject, uniq } from "rambda";
import { formatDate } from "../../../../lib/format";
import { useFilterContext } from "../../../../filter/context";
import { defaultDateRange } from "../../../../lib/intervals";
import {
  ExpandableOptions,
  ExpandableOptionsHeader,
} from "../../../../components/expandable-options";

export type FilterOptions = {
  hierarchyLevel?: HierarchyLevel;
  dates?: DateRange;
  resolutions?: string[];
  statuses?: string[];
  issueTypes?: string[];
};

type FilterOptionsProps = {
  issues: Issue[];

  showDateSelector: boolean;
  showResolutionFilter: boolean;
  showStatusFilter: boolean;
};

export const FilterOptionsForm: FC<FilterOptionsProps> = ({
  issues,
  showDateSelector,
  showResolutionFilter,
  showStatusFilter,
}) => {
  const { filter: initialFilter, setFilter } = useFilterContext();

  const [resolutions, setResolutions] = useState<SelectProps["options"]>();
  const [statuses, setStatuses] = useState<SelectProps["options"]>();
  const [issueTypes, setIssueTypes] = useState<SelectProps["options"]>();

  const [hierarchyLevel, setHierarchyLevel] = useState<HierarchyLevel>(
    initialFilter.hierarchyLevel ?? HierarchyLevel.Story,
  );

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
  }, [issues, hierarchyLevel, setResolutions, setIssueTypes, setStatuses]);

  const [selectedResolutions, setSelectedResolutions] = useState<string[]>(
    showResolutionFilter ? initialFilter.resolutions ?? [] : [],
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    showStatusFilter ? initialFilter.statuses ?? [] : [],
  );
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<string[]>(
    initialFilter.issueTypes ?? [],
  );

  const [dates, setDates] = useState<RangeType>(() => {
    return showDateSelector ? initialFilter.dates ?? defaultDateRange() : null;
  });

  useEffect(() => {
    setFilter({
      dates,
      resolutions: selectedResolutions,
      statuses: selectedStatuses,
      issueTypes: selectedIssueTypes,
      hierarchyLevel,
    });
  }, [
    setFilter,
    dates,
    selectedResolutions,
    selectedStatuses,
    selectedIssueTypes,
    hierarchyLevel,
  ]);
  const options: ExpandableOptionsHeader["options"][number][] = [];

  if (dates) {
    options.push({
      label: "Dates",
      value: `${formatDate(dates[0])}-${formatDate(dates[1])}`,
    });
  }
  options.push({ label: "Hierarchy level", value: hierarchyLevel });
  if (selectedResolutions.length) {
    options.push({ label: "Resolutions", value: selectedResolutions.join() });
  }
  if (selectedStatuses.length) {
    options.push({ label: "Statuses", value: selectedStatuses.join() });
  }
  if (selectedIssueTypes.length) {
    options.push({ label: "Issue types", value: selectedIssueTypes.join() });
  }

  return (
    <ExpandableOptions header={{ title: "Filter Options", options }}>
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

const getUniqueValues = (issues: Issue[], property: keyof Issue): string[] => {
  return pipe(
    map((issue: Issue) => issue[property]),
    reject(isNil),
    uniq,
  )(issues);
};
