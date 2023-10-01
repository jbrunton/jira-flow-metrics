import { IssuesTable } from "../../../components/issues-table";
import { useNavigationContext } from "../../../navigation/context";

export const IssuesIndexPage = () => {
  const { issues, dataset } = useNavigationContext();
  return (
    <>
      <h1>{dataset?.name} issues</h1>
      <IssuesTable issues={issues ?? []} />
    </>
  );
};
