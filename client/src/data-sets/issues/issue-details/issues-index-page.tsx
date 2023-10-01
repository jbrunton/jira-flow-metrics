import { useParams } from "react-router-dom";
import { useIssues } from "../../../data/issues";
import { IssuesTable } from "../../../components/issues-table";

export const IssuesIndexPage = () => {
  const { datasetId } = useParams();
  const { data: issues } = useIssues(datasetId);
  return <IssuesTable issues={issues ?? []} />;
};
