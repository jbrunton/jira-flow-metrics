import { useParams } from "react-router-dom";
import { useIssues } from "../data/issues";
import { IssuesTable } from "../components/issues-table";

export const IssuesIndexPage = () => {
  const { dataSetId } = useParams();
  const { data: issues } = useIssues(dataSetId);
  return <IssuesTable issues={issues ?? []} />
}
