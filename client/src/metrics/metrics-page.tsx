import { Col, Form, Row, Select } from "antd";
import { CompleteIssue, HierarchyLevel, isCompleted, useIssues } from "../data/issues"
import { useNavigationContext } from "../navigation/context";
import Scatterplot from "./components/scatterplot";
import { useEffect, useState } from "react";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { DatePicker, RangeType } from "./components/date-picker";

export const MetricsPage = () => {
  const { dataSet } = useNavigationContext();
  const { data: issues } = useIssues(dataSet?.id);

  const [hierarchyLevel, setHierarchyLevel] = useState<HierarchyLevel>(HierarchyLevel.Story);

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
      .filter(issue => endDate && issue.completed <= endDate);

    setFilteredIssues(filteredIssues ?? []);
  }, [issues, hierarchyLevel, dates]);

  return <>
    <Form layout="vertical">
      <Row gutter={[8, 8]}>
        <Col>
          <Form.Item label="Hierarchy Level">
            <Select value={hierarchyLevel} onChange={setHierarchyLevel}>
              <Select.Option value="Story">Story</Select.Option>
              <Select.Option value="Epic">Epic</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="Dates">
            <DatePicker.RangePicker
              allowClear={false}
              value={dates}
              onChange={setDates}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
    <Scatterplot issues={filteredIssues} />
  </>;
}
