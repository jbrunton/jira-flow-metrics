import { Col, Drawer, Form, Row, Select, SelectProps } from "antd";
import { CompleteIssue, HierarchyLevel, Issue, isCompleted, useIssues } from "../../data/issues"
import { useNavigationContext } from "../../navigation/context";
import Scatterplot from "./components/scatterplot";
import { useEffect, useState } from "react";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { RangeType } from "./components/date-picker";
import { isNil, map, pipe, reject, uniq } from "rambda";
import { DateSelector } from "./components/date-selector";
import { IssueDetails } from "./components/issue-details";
import { IssuesTable } from "../../components/issues-table";

export const ScatterplotPage = () => {
  const { dataSet } = useNavigationContext();
  const { data: issues } = useIssues(dataSet?.id);

  const [hierarchyLevel, setHierarchyLevel] = useState<HierarchyLevel>(HierarchyLevel.Story);

  const [resolutions, setResoutions] = useState<SelectProps["options"]>();

  useEffect(() => {
    if (!issues) {
      return;
    }

    const resolutions = pipe(
      map((issue: Issue) => issue.resolution),
      reject(isNil),
      uniq
    )(issues);

    setResoutions(
      resolutions.map(resolution => ({
        label: resolution,
        value: resolution,
      }))
    );
  }, [issues]);

  const [selectedResolutions, setSelectedResolutions] = useState<string[]>([]);

  const [filteredIssues, setFilteredIssues] = useState<CompleteIssue[]>([]);

  const [dates, setDates] = useState<RangeType>(() => {
    const today = new Date();
    const defaultStart = startOfDay(subDays(today, 30));
    const defaultEnd = endOfDay(today);
    return [defaultStart, defaultEnd];
  });

  useEffect(() => {
    const [startDate, endDate] = dates ?? [];

    const filteredIssues = issues
      ?.filter(isCompleted)
      .filter(issue => issue.hierarchyLevel === hierarchyLevel)
      .filter(issue => startDate && issue.completed >= startDate)
      .filter(issue => endDate && issue.completed <= endDate)
      .filter(issue => selectedResolutions.length === 0 || selectedResolutions.includes(issue.resolution));

    setFilteredIssues(filteredIssues ?? []);
  }, [issues, hierarchyLevel, dates, selectedResolutions]);

  const [selectedIssues, setSelectedIssues] = useState<Issue[]>([]);

  console.info(selectedIssues);

  return <>
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
      </Row>
    </Form>
    <Scatterplot issues={filteredIssues} range={dates} setSelectedIssues={setSelectedIssues} />
    <IssuesTable issues={filteredIssues} />
    <Drawer
        placement="right"
        width="30%"
        closable={false}
        onClose={() => setSelectedIssues([])}
        open={selectedIssues.length > 0}
      >
        {selectedIssues.map((issue) => (
          <IssueDetails key={issue.key} issue={issue} />
        ))}
      </Drawer>
  </>;
}