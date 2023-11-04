import { FC, useEffect, useState } from "react";
import { DateRange, HierarchyLevel, Issue } from "../../../../data/issues";
import {
  Col,
  Collapse,
  Form,
  Row,
  Select,
  SelectProps,
  Tag,
  Typography,
} from "antd";
import { RangeType } from "../date-picker";
import { DateSelector } from "../date-selector";
import { isNil, map, pipe, reject, uniq } from "rambda";
import { formatDate } from "../../../../lib/format";
import { useFilterContext } from "../../../../filter/context";
import { defaultDateRange } from "../../../../lib/intervals";

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
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const description = (
    <span>
      Filter options &nbsp;
      {expandedKeys.length === 0 ? (
        <Typography.Text type="secondary">
          {dates ? (
            <>
              dates:{" "}
              <Tag>
                {formatDate(dates[0])}-{formatDate(dates[1])}
              </Tag>
            </>
          ) : null}
          {hierarchyLevel ? (
            <>
              hierarchy level: <Tag>{hierarchyLevel}</Tag>
            </>
          ) : null}
          {selectedResolutions.length ? (
            <>
              resolutions: <Tag>{selectedResolutions.join()}</Tag>
            </>
          ) : null}
          {selectedStatuses.length ? (
            <>
              statuses: <Tag>{selectedStatuses.join()}</Tag>
            </>
          ) : null}
        </Typography.Text>
      ) : null}
    </span>
  );
  return (
    <Collapse
      size="small"
      style={{ marginBottom: 8 }}
      bordered={false}
      onChange={(keys) => setExpandedKeys(keys as string[])}
      items={[
        {
          key: "filter",
          label: description,
          children: (
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
          ),
        },
      ]}
    />
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
