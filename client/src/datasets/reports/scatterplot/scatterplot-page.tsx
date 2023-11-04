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

  return (
    <>
      <FilterOptionsForm
        issues={issues ?? []}
        showDateSelector={true}
        showStatusFilter={false}
        showResolutionFilter={true}
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
