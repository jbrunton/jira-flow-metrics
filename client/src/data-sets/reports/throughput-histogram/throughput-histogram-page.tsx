import { useEffect, useState } from "react";
import {
  CompletedIssue,
  filterCompletedIssues,
  useIssues,
} from "../../../data/issues";
import { useNavigationContext } from "../../../navigation/context";
import { FilterForm } from "../components/filter-form";
import { Interval, TimeUnit } from "../../../lib/intervals";
import { Col, Form, Select } from "antd";
import { ThroughputResult, calculateThroughput } from "../../../lib/throughput";
import { useFilterContext } from "../../../filter/context";
import { count, range } from "rambda";
import { quantileSeq } from "mathjs";
import {
  Bucket,
  Percentile,
  ThroughputHistogram,
} from "./components/throughput-histogram";

export const ThroughputHistogramPage = () => {
  const { dataset } = useNavigationContext();
  const { data: issues } = useIssues(dataset?.id);

  const { filter, setFilter } = useFilterContext();

  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.Day);

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

    setThroughputResult(
      calculateThroughput({
        issues: filteredIssues,
        interval,
        timeUnit,
      }),
    );
  }, [filter, timeUnit, filteredIssues]);

  const [buckets, setBuckets] = useState<Bucket[]>([]);

  const [percentiles, setPercentiles] = useState<Percentile[]>([]);

  useEffect(() => {
    if (!throughputResult) {
      return;
    }

    const throughputCounts = throughputResult.map((item) => item.count);

    const maxThroughput = Math.max(...throughputCounts);

    const buckets = range(0, maxThroughput).map((throughput) => ({
      throughput,
      frequency: count((item) => item.count === throughput, throughputResult),
    }));

    setBuckets(buckets);

    const orderedValues = throughputResult.map((x) => x.count);

    const quantiles =
      orderedValues.length > 20
        ? [0.5, 0.7, 0.85, 0.95]
        : orderedValues.length > 10
        ? [0.5, 0.7]
        : orderedValues.length >= 5
        ? [0.5]
        : [];

    const percentiles = quantiles.map((quantile) => {
      return {
        percentile: quantile * 100,
        throughput: Math.ceil(
          quantileSeq(throughputCounts, quantile) as number,
        ),
      };
    });
    setPercentiles(percentiles);
  }, [throughputResult]);

  return (
    <>
      <h1>{dataset?.name} throughput histogram</h1>
      <FilterForm
        issues={filteredIssues}
        filter={filter}
        showDateSelector={true}
        showStatusFilter={false}
        showResolutionFilter={true}
        onFilterChanged={setFilter}
        additionalOptions={
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
        }
      />
      {throughputResult ? (
        <ThroughputHistogram buckets={buckets} percentiles={percentiles} />
      ) : null}
    </>
  );
};
