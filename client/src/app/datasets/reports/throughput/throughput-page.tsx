import { useEffect, useState } from "react";
import { CompletedIssue, Issue } from "@entities/issues";
import { Interval, TimeUnit, getOverlappingInterval } from "@lib/intervals";
import { ThroughputChart } from "./components/throughput-chart";
import { Col, Form, Row, Select } from "antd";
import {
  ThroughputResult,
  calculateThroughput,
} from "@usecases/throughput/throughput";
import { IssuesTable } from "../../../components/issues-table";
import { useFilterContext } from "../../../filter/context";
import { ExpandableOptions } from "../../../components/expandable-options";
import { FilterOptionsForm } from "../components/filter-form/filter-options-form";
import { useDatasetContext } from "../../context";
import { filterCompletedIssues } from "@data/issues";

export const ThroughputPage = () => {
  const { issues } = useDatasetContext();
  const { filter } = useFilterContext();

  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.Day);
  const [filteredIssues, setFilteredIssues] = useState<CompletedIssue[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<Issue[]>([]);
  const [throughputResult, setThroughputResult] = useState<ThroughputResult>();

  useEffect(() => {
    if (!filter?.dates || !issues) {
      return;
    }

    const interval: Interval = getOverlappingInterval(filter.dates, timeUnit);

    const filteredIssues = filterCompletedIssues(issues, {
      ...filter,
      dates: interval,
    });
    setFilteredIssues(filteredIssues);

    setThroughputResult(
      calculateThroughput({
        issues: filteredIssues,
        interval,
        timeUnit,
      }),
    );
  }, [filter, timeUnit, issues]);

  return (
    <>
      <FilterOptionsForm
        issues={issues}
        filteredIssuesCount={filteredIssues.length}
        showDateSelector={true}
        showStatusFilter={false}
        showResolutionFilter={true}
      />

      <ExpandableOptions
        header={{
          title: "Chart Options",
          options: [{ label: "time unit", value: timeUnit }],
        }}
      >
        <Row gutter={[8, 8]}>
          <Col span={4}>
            <Form.Item label="Time Unit">
              <Select value={timeUnit} onChange={setTimeUnit}>
                <Select.Option key={TimeUnit.Day}>Days</Select.Option>
                <Select.Option key={TimeUnit.Week}>Weeks</Select.Option>
                <Select.Option key={TimeUnit.Fortnight}>
                  Fortnights
                </Select.Option>
                <Select.Option key={TimeUnit.Month}>Months</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </ExpandableOptions>
      {throughputResult ? (
        <ThroughputChart
          result={throughputResult}
          timeUnit={timeUnit}
          setSelectedIssues={setSelectedIssues}
        />
      ) : null}
      <IssuesTable issues={selectedIssues} defaultSortField="cycleTime" />
    </>
  );
};
