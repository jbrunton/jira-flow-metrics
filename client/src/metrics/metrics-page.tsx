import { useIssues } from "../data/issues"
import { useNavigationContext } from "../navigation/context";
import Scatterplot from "./components/scatterplot";

export const MetricsPage = () => {
  const { dataSet } = useNavigationContext();
  const { data: issues } = useIssues(dataSet?.id);
  return <Scatterplot issues={issues ?? []} />
}

