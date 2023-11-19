import { useEffect, useState } from "react";
import { Issue, filterIssues } from "../../../data/issues";
import { IssuesTable } from "../../../components/issues-table";
import { useFilterContext } from "../../../filter/context";
import { WipResult, calculateWip } from "../../../lib/wip";
import { WipChart } from "./components/wip-chart";
import { omit } from "rambda";
import { Checkbox, Col, Row } from "antd";
import { FilterOptionsForm } from "../components/filter-form/filter-options-form";
import { useDatasetContext } from "../../context";
import { ExpandableOptions } from "../../../components/expandable-options";

export const WipPage = () => {
  const { issues } = useDatasetContext();

  const { filter } = useFilterContext();

  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);

  const [selectedIssues, setSelectedIssues] = useState<Issue[]>([]);

  const [includeStoppedIssues, setIncludeStoppedIssues] = useState(false);

  useEffect(() => {
    // reset the selected issue list if we change the filter
    setSelectedIssues([]);
  }, [filter, includeStoppedIssues]);

  useEffect(() => {
    if (filter && issues) {
      const filteredIssues = filterIssues(
        issues,
        omit(["dates"], filter),
      ).filter((issue) => {
        if (includeStoppedIssues) {
          return true;
        }

        const isStopped =
          issue.metrics.started && issue.statusCategory === "To Do";

        return !isStopped;
      });
      setFilteredIssues(filteredIssues);
    }
  }, [issues, filter, includeStoppedIssues, setFilteredIssues]);

  const [wipResult, setWipResult] = useState<WipResult>();

  useEffect(() => {
    if (!filter || !filter.dates || !filter.dates[0] || !filter.dates[1]) {
      return;
    }

    setWipResult(
      calculateWip({
        issues: filteredIssues,
        range: filter.dates,
      }),
    );
  }, [filter, filteredIssues]);

  return (
    <>
      <FilterOptionsForm
        issues={issues ?? []}
        showDateSelector={true}
        showStatusFilter={false}
        showResolutionFilter={false}
      />
      <ExpandableOptions
        header={{
          title: "Chart Options",
          options: [
            {
              value: includeStoppedIssues
                ? "Include stopped issues"
                : "Exclude stopped issues",
            },
          ],
        }}
      >
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Checkbox
              checked={includeStoppedIssues}
              onChange={(e) => setIncludeStoppedIssues(e.target.checked)}
            >
              Include stopped issues
            </Checkbox>
          </Col>
        </Row>
      </ExpandableOptions>

      {wipResult ? (
        <WipChart result={wipResult} setSelectedIssues={setSelectedIssues} />
      ) : null}
      <IssuesTable issues={selectedIssues} defaultSortField="cycleTime" />
    </>
  );
};
