import { useEffect, useState } from "react";
import { Issue, filterIssues, useIssues } from "../../../data/issues";
import { useNavigationContext } from "../../../navigation/context";
import { FilterForm } from "../components/filter-form";
import { IssuesTable } from "../../../components/issues-table";
import { useFilterContext } from "../../../filter/context";
import { WipResult, calculateWip } from "../../../lib/wip";
import { WipChart } from "./components/wip-chart";
import { omit } from "rambda";
import { Checkbox, Col, Form } from "antd";

export const WipPage = () => {
  const { dataset } = useNavigationContext();
  const { data: issues } = useIssues(dataset?.id);

  const { filter, setFilter } = useFilterContext();

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
      <h1>{dataset?.name} WIP</h1>
      <FilterForm
        issues={filteredIssues}
        filter={filter}
        showDateSelector={true}
        showStatusFilter={false}
        showResolutionFilter={false}
        onFilterChanged={setFilter}
        additionalOptions={
          <Col span={6}>
            <Form.Item label="Options">
              <Checkbox
                checked={includeStoppedIssues}
                onChange={(e) => setIncludeStoppedIssues(e.target.checked)}
              >
                Include stopped issues
              </Checkbox>
            </Form.Item>
          </Col>
        }
      />
      {wipResult ? (
        <WipChart result={wipResult} setSelectedIssues={setSelectedIssues} />
      ) : null}
      <IssuesTable issues={selectedIssues} defaultSortField="cycleTime" />
    </>
  );
};
