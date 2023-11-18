import {
  CompletedIssue,
  Issue,
  filterCompletedIssues,
} from "../../../data/issues";
import { Scatterplot } from "./components/scatterplot";
import { useEffect, useState } from "react";
import { IssueDetailsDrawer } from "./components/issue-details-drawer";
import { IssuesTable } from "../../../components/issues-table";
import { useFilterContext } from "../../../filter/context";
import { Percentile, getCycleTimePercentiles } from "../../../lib/cycle-times";
import { FilterOptionsForm } from "../components/filter-form/filter-options-form";
import { useDatasetContext } from "../../context";
import { Checkbox, Col, Row, Tag, Typography } from "antd";
import { ExpandableOptions } from "../../../components/expandable-options";

export const ScatterplotPage = () => {
  const { issues } = useDatasetContext();

  const { filter } = useFilterContext();

  const [filteredIssues, setFilteredIssues] = useState<CompletedIssue[]>([]);
  const [percentiles, setPercentiles] = useState<Percentile[] | undefined>();

  useEffect(() => {
    if (filter && issues) {
      const filteredIssues = filterCompletedIssues(issues, filter);
      const percentiles = getCycleTimePercentiles(filteredIssues);
      setFilteredIssues(filteredIssues);
      setPercentiles(percentiles);
    }
  }, [issues, filter, setFilteredIssues, setPercentiles]);

  const [selectedIssues, setSelectedIssues] = useState<Issue[]>([]);

  const [showPercentileLabels, setShowPercentileLabels] = useState(false);

  const chartOptionsTitle = (expanded: boolean) => (
    <span>
      Chart Options &nbsp;
      {expanded ? (
        <Typography.Text type="secondary">
          {showPercentileLabels ? <Tag>Show percentile labels</Tag> : null}
        </Typography.Text>
      ) : null}
    </span>
  );

  return (
    <>
      <FilterOptionsForm
        issues={issues ?? []}
        showDateSelector={true}
        showStatusFilter={false}
        showResolutionFilter={true}
      />

      <ExpandableOptions title={chartOptionsTitle}>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Checkbox
              checked={showPercentileLabels}
              onChange={(e) => setShowPercentileLabels(e.target.checked)}
            >
              Show percentile labels
            </Checkbox>
          </Col>
        </Row>
      </ExpandableOptions>

      <Scatterplot
        issues={filteredIssues}
        percentiles={percentiles}
        range={filter?.dates ?? null}
        setSelectedIssues={setSelectedIssues}
        showPercentileLabels={showPercentileLabels}
      />
      <IssuesTable
        issues={filteredIssues}
        percentiles={percentiles}
        defaultSortField="cycleTime"
      />

      <IssueDetailsDrawer
        selectedIssues={selectedIssues}
        onClose={() => setSelectedIssues([])}
        open={selectedIssues.length > 0}
      />
    </>
  );
};
