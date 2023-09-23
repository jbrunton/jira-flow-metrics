import { useEffect, useState } from "react";
import { CompletedIssue, IssueFilter, filterCompletedIssues, useIssues } from "../../data/issues";
import { useNavigationContext } from "../../navigation/context";
import { FilterForm } from "./components/filter-form"
import { Interval, TimeUnit } from "../../lib/intervals";
import { ThroughputChart } from "./components/throughput-chart";
import { Col, Form, Select } from "antd";
import { ThroughputResult, calculateThroughput } from "../../lib/throughput";

export const ThroughputPage = () => {
  const { dataSet } = useNavigationContext();
  const { data: issues } = useIssues(dataSet?.id);

  const [filter, setFilter] = useState<IssueFilter>();

  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.Week);

  const [filteredIssues, setFilteredIssues] = useState<CompletedIssue[]>([]);

  useEffect(() => {
    if (filter && issues) {
      const filteredIssues = filterCompletedIssues(issues, filter);
      setFilteredIssues(filteredIssues);  
    }
  }, [issues, filter, setFilteredIssues]);

  const [throughputResult, setThroughputResult] = useState<ThroughputResult>();

  useEffect(() => {
    if (!filter || !filter.dates || !filter.dates[0] || !filter.dates[1]) {
      return;
    }

    const interval: Interval = { start: filter.dates[0], end: filter.dates[1] };

    setThroughputResult(calculateThroughput({
      issues: filteredIssues, interval, timeUnit
    }));
  }, [filter, timeUnit, filteredIssues]);

  return (
    <>
    <FilterForm issues={filteredIssues} onFilterChanged={setFilter} additionalOptions={
      <Col span={4}>
        <Form.Item label="Time Unit">
          <Select value={timeUnit} onChange={setTimeUnit}>
            <Select.Option key={TimeUnit.Day}>Days</Select.Option>
            <Select.Option key={TimeUnit.Week}>Weeks</Select.Option>
            <Select.Option key={TimeUnit.Month}>Months</Select.Option>
          </Select>
        </Form.Item>
      </Col>
    } />
    {throughputResult ? <ThroughputChart result={throughputResult} timeUnit={TimeUnit.Week} /> : null}
    </>
  )
}

