import {
  CompletedIssue,
  Issue,
  filterCompletedIssues,
  useIssues,
} from "../../../data/issues";
import { useNavigationContext } from "../../../navigation/context";
import { Scatterplot } from "./components/scatterplot";
import { useEffect, useState } from "react";
import { IssueDetailsDrawer } from "./components/issue-details-drawer";
import { IssuesTable } from "../../../components/issues-table";
import { FilterForm } from "../components/filter-form";
import { useFilterContext } from "../../../filter/context";
import { Percentile, getCycleTimePercentiles } from "../../../lib/cycle-times";

export const ScatterplotPage = () => {
  const { dataset } = useNavigationContext();

  const { filter, setFilter } = useFilterContext();

  const { data: issues } = useIssues(
    dataset?.id,
    filter.fromStatus,
    filter.toStatus,
  );

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

  return (
    <>
      <h1>{dataset?.name} cycle times</h1>
      <FilterForm
        filter={filter}
        issues={issues ?? []}
        showDateSelector={true}
        showStatusFilter={false}
        showResolutionFilter={true}
        onFilterChanged={setFilter}
      />

      <Scatterplot
        issues={filteredIssues}
        percentiles={percentiles}
        range={filter?.dates ?? null}
        setSelectedIssues={setSelectedIssues}
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
