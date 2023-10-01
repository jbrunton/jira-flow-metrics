import { IssuesTable } from "../../../components/issues-table";
import { HierarchyLevel } from "../../../data/issues";
import { useNavigationContext } from "../../../navigation/context";
import IssueDetails from "../../reports/components/issue-details";

export const IssueDetailsPage = () => {
  const { issue, issueKey, issues } = useNavigationContext();
  const isEpic = issue?.hierarchyLevel === HierarchyLevel.Epic;
  const children = isEpic
    ? issues?.filter((issue) => issue.parentKey === issueKey)
    : undefined;
  return issue ? (
    <>
      <IssueDetails issue={issue} />
      {isEpic ? (
        <IssuesTable issues={children ?? []} parentEpic={issue} />
      ) : null}
    </>
  ) : null;
};
