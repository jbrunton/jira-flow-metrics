import { useNavigationContext } from "../../navigation/context";
import IssueDetails from "../reports/components/issue-details";

export const IssueDetailsPage = () => {
  const { issue } = useNavigationContext();

  return issue ? <IssueDetails issue={issue} /> : null;
};
