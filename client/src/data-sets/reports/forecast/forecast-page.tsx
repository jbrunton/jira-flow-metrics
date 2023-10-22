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

export const ForecastPage = () => {
  const { dataset } = useNavigationContext();
  const { data: issues } = useIssues(dataset?.id);

  const { filter, setFilter } = useFilterContext();

  const [filteredIssues, setFilteredIssues] = useState<CompletedIssue[]>([]);

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
    const measurements = measure(filteredIssues);
    const startDate = new Date();
    const runs = run(
      100, // backlog size
      measurements,
      10000,
      startDate,
      // params.excludeLeadTimes,
      newGenerator(1234), // pass seed
    );
    const results = summarize(
      runs,
      startDate,
      // params.includeLongTails
    );
    setSummary(results);
  }, [filteredIssues]);

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
      <ForecastChart summary={summary ?? []} />
    </>
  );
};
