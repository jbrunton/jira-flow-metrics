import { useEffect, useState } from "react";
import { CompletedIssue, filterCompletedIssues } from "../../../data/issues";
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
  Form,
  InputNumber,
  Row,
  Space,
  Tooltip,
} from "antd";
import { DatePicker } from "../components/date-picker";
import { RedoOutlined } from "@ant-design/icons";
import { FilterOptionsForm } from "../components/filter-form/filter-options-form";
import { ExpandableOptions } from "../../../components/expandable-options";
import { useDatasetContext } from "../../context";

export const ForecastPage = () => {
  const { issues } = useDatasetContext();

  const { filter } = useFilterContext();

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
      <FilterOptionsForm
        issues={issues ?? []}
        showDateSelector={true}
        showStatusFilter={false}
        showResolutionFilter={true}
      />
      <ExpandableOptions title={() => "Chart Options"}>
        <Form layout="vertical">
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
          <Row>
            <Space direction="vertical">
              <Checkbox
                checked={includeLongTail}
                onChange={(e) => setIncludeLongTail(e.target.checked)}
              >
                Include long tail
              </Checkbox>
              <Checkbox
                checked={excludeLeadTimes}
                onChange={(e) => setExcludeLeadTimes(e.target.checked)}
              >
                Exclude lead times
              </Checkbox>
              <Checkbox
                checked={excludeOutliers}
                onChange={(e) => setExcludeOutliers(e.target.checked)}
              >
                Exclude cycle time outliers
              </Checkbox>
            </Space>
          </Row>
        </Form>
      </ExpandableOptions>
      <ForecastChart summary={summary ?? []} />
    </>
  );
};

const newSeed = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
