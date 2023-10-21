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

export const ScatterplotPage = () => {
  const { dataset } = useNavigationContext();
  const { data: issues } = useIssues(dataset?.id);

  const { filter, setFilter } = useFilterContext();

  const [filteredIssues, setFilteredIssues] = useState<CompletedIssue[]>([]);

  useEffect(() => {
    if (filter && issues) {
      const filteredIssues = filterCompletedIssues(issues, filter);
      setFilteredIssues(filteredIssues);
    }
  }, [issues, filter, setFilteredIssues]);

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
        range={filter?.dates ?? null}
        setSelectedIssues={setSelectedIssues}
      />
      <IssuesTable issues={filteredIssues} defaultSortField="cycleTime" />
      <IssueDetailsDrawer
        selectedIssues={selectedIssues}
        onClose={() => setSelectedIssues([])}
        open={selectedIssues.length > 0}
      />
    </>
  );
};
