import { useEffect, useState } from "react";
import {
  CompletedIssue,
  filterCompletedIssues,
  useIssues,
} from "../../../data/issues";
import { useNavigationContext } from "../../../navigation/context";
import { FilterForm } from "../components/filter-form";
import { useFilterContext } from "../../../filter/context";
import {
  SummaryRow,
  measure,
  run,
  summarize,
} from "../../../lib/simulation/run";
import { newGenerator } from "../../../lib/simulation/select";
import { ForecastChart } from "./components/forecast-chart";
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  InputNumber,
  Row,
  Space,
  Tooltip,
} from "antd";
import { DatePicker } from "../components/date-picker";
import { RedoOutlined } from "@ant-design/icons";

export const ForecastPage = () => {
  const { dataset } = useNavigationContext();
  const { data: issues } = useIssues(dataset?.id);

  const { filter, setFilter } = useFilterContext();

  const [filteredIssues, setFilteredIssues] = useState<CompletedIssue[]>([]);

  const [issueCount, setIssueCount] = useState(10);
  const [startDate, setStartDate] = useState(new Date());
  const [seed, setSeed] = useState(newSeed());

  const [includeLongTail, setIncludeLongTail] = useState(false);
  const [excludeLeadTimes, setExcludeLeadTimes] = useState(false);
  const [excludeOutliers, setExcludeOutliers] = useState(false);

  useEffect(() => {
    if (filter && issues) {
      const filteredIssues = filterCompletedIssues(issues, filter).sort(
        (i1, i2) =>
          i1.metrics.completed.getTime() - i2.metrics.completed.getTime(),
      );
      setFilteredIssues(filteredIssues);
    }
  }, [issues, filter, setFilteredIssues]);

  const [summary, setSummary] = useState<SummaryRow[]>();

  useEffect(() => {
    if (!filteredIssues || filteredIssues.length === 0) return;
    const measurements = measure(filteredIssues, excludeOutliers);
    const runs = run(
      issueCount,
      measurements,
      10000,
      startDate,
      excludeLeadTimes,
      newGenerator(seed),
    );
    const results = summarize(runs, startDate, includeLongTail);
    setSummary(results);
  }, [
    filteredIssues,
    issueCount,
    seed,
    startDate,
    includeLongTail,
    excludeLeadTimes,
    excludeOutliers,
  ]);

  return (
    <>
      <h1>{dataset?.name} forecasts</h1>
      <FilterForm
        issues={filteredIssues}
        filter={filter}
        showDateSelector={true}
        showStatusFilter={false}
        showResolutionFilter={true}
        onFilterChanged={setFilter}
      />
      <Form layout="vertical" style={{ marginTop: -24 }}>
        <Row gutter={[8, 8]}>
          <Col span={2}>
            <Form.Item label="Issue count">
              <InputNumber
                style={{ width: "100%" }}
                value={issueCount}
                onChange={(e) => {
                  if (e) {
                    setIssueCount(e);
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Start date">
              <DatePicker
                style={{ width: "100%" }}
                value={startDate}
                allowClear={false}
                onChange={(e) => {
                  if (e) {
                    setStartDate(e);
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Seed">
              <Space.Compact style={{ width: "100%" }}>
                <InputNumber
                  style={{ width: "100%" }}
                  value={seed}
                  onChange={(e) => {
                    if (e) {
                      setSeed(e);
                    }
                  }}
                />
                <Tooltip title="Refresh">
                  <Button
                    icon={<RedoOutlined onClick={() => setSeed(newSeed())} />}
                  />
                </Tooltip>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Collapse
        style={{ marginBottom: 24 }}
        bordered={false}
        size="small"
        items={[
          {
            key: "advanced",
            label: "Advanced options",
            children: (
              <Space direction="vertical">
                <Checkbox
                  value={includeLongTail}
                  onChange={(e) => setIncludeLongTail(e.target.checked)}
                >
                  Include long tail
                </Checkbox>
                <Checkbox
                  value={excludeLeadTimes}
                  onChange={(e) => setExcludeLeadTimes(e.target.checked)}
                >
                  Exclude lead times
                </Checkbox>
                <Checkbox
                  value={excludeOutliers}
                  onChange={(e) => setExcludeOutliers(e.target.checked)}
                >
                  Exclude cycle time outliers
                </Checkbox>
              </Space>
            ),
          },
        ]}
      />
      <ForecastChart summary={summary ?? []} />
    </>
  );
};

const newSeed = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
