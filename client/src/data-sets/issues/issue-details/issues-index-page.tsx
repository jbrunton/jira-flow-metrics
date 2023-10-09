import { useEffect, useState } from "react";
import { IssuesTable, SortState } from "../../../components/issues-table";
import { useFilterContext } from "../../../filter/context";
import { useNavigationContext } from "../../../navigation/context";
import { FilterForm } from "../../reports/components/filter-form";
import { Issue, filterIssues } from "../../../data/issues";
import { omit, pipe, sortBy } from "rambda";
import { Col, Form, Input } from "antd";
import * as fuzzball from "fuzzball";

export const IssuesIndexPage = () => {
  const { issues, dataset } = useNavigationContext();
  const { filter, setFilter } = useFilterContext();

  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [sortState, setSortState] = useState<SortState>({
    columnKey: "created",
    sortOrder: "descend",
  });

  useEffect(() => {
    if (filter && issues) {
      const filteredIssues = pipe(
        (issues) => filterIssues(issues, omit(["dates"], filter)),
        (issues) => {
          if (searchQuery.trim().length === 0) {
            return issues;
          }

          const searchedIssues = issues
            .map((issue) => {
              const sortResult = fuzzball.extract(
                searchQuery,
                [issue.key, issue.summary],
                { scorer: fuzzball.token_set_ratio },
              );
              const sortIndex = Math.max(
                ...sortResult.map(([, score]) => score),
              );
              return {
                ...issue,
                sortIndex,
              };
            })
            .filter((issue) => issue.sortIndex >= 60);

          const sortedIssues = sortBy(
            (issue) => -issue.sortIndex,
            searchedIssues,
          );

          return sortedIssues;
        },
      )(issues);
      setFilteredIssues(filteredIssues);
    }
  }, [issues, filter, searchQuery, setFilteredIssues]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setSortState({
        columnKey: undefined,
        sortOrder: null,
      });
    }
  }, [searchQuery]);

  return (
    <>
      <h1>{dataset?.name} issues</h1>
      <FilterForm
        showDateSelector={false}
        showStatusFilter={true}
        showResolutionFilter={true}
        issues={issues ?? []}
        filter={filter}
        onFilterChanged={setFilter}
        additionalOptions={
          <Col span={6}>
            <Form.Item label="Search">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Item>
          </Col>
        }
      />
      <IssuesTable
        issues={filteredIssues}
        defaultSortField="created"
        sortState={sortState}
        onSortStateChanged={setSortState}
      />
    </>
  );
};
