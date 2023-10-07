import { useEffect, useState } from "react";
import { IssuesTable } from "../../../components/issues-table";
import { useFilterContext } from "../../../filter/context";
import { useNavigationContext } from "../../../navigation/context";
import { FilterForm } from "../../reports/components/filter-form";
import { Issue, filterIssues } from "../../../data/issues";
import { pick, pipe } from "rambda";
import { Col, Form, Input } from "antd";

export const IssuesIndexPage = () => {
  const { issues, dataset } = useNavigationContext();
  const { filter, setFilter } = useFilterContext();

  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (filter && issues) {
      const filteredIssues = pipe(
        (issues) =>
          filterIssues(issues, pick(["hierarchyLevel", "resolution"], filter)),
        (issues) => {
          if (searchQuery.trim().length === 0) {
            return issues;
          }
          return issues.filter(
            (issue) =>
              issue.key.includes(searchQuery) ||
              issue.summary.includes(searchQuery),
          );
        },
      )(issues);
      setFilteredIssues(filteredIssues);
    }
  }, [issues, filter, searchQuery, setFilteredIssues]);

  return (
    <>
      <h1>{dataset?.name} issues</h1>
      <FilterForm
        showDateSelector={false}
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
      <IssuesTable issues={filteredIssues} defaultSortField="created" />
    </>
  );
};
