import { Drawer } from "antd";
import {
  CompletedIssue,
  Issue,
  filterCompletedIssues,
  useIssues,
} from "../../../data/issues";
import { useNavigationContext } from "../../../navigation/context";
import { Scatterplot } from "../components/scatterplot";
import { useEffect, useState } from "react";
import { IssueDetails } from "../components/issue-details";
import { IssuesTable } from "../../../components/issues-table";
import { FilterForm } from "../components/filter-form";
import { useFilterContext } from "../../../filter/context";

export const ScatterplotPage = () => {
  const { dataSet } = useNavigationContext();
  const { data: issues } = useIssues(dataSet?.id);

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
      <FilterForm
        filter={filter}
        issues={issues ?? []}
        onFilterChanged={setFilter}
      />
      <Scatterplot
        issues={filteredIssues}
        range={filter?.dates ?? null}
        setSelectedIssues={setSelectedIssues}
      />
      <IssuesTable issues={filteredIssues} />
      <Drawer
        placement="right"
        width="30%"
        closable={false}
        onClose={() => setSelectedIssues([])}
        open={selectedIssues.length > 0}
      >
        {selectedIssues.map((issue) => (
          <IssueDetails key={issue.key} issue={issue} />
        ))}
      </Drawer>
    </>
  );
};
