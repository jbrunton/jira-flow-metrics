import { Link, Route } from "react-router-dom";
import { NavigationContext } from "../../navigation/context";
import { IssuesIndexPage } from "./issue-details/issues-index-page";
import { IssueDetailsPage } from "./issue-details/issue-details-page";
import { issuesIndexPath } from "../../navigation/paths";

export const issueRoutes = (
  <Route
    path="issues"
    handle={{
      crumb: ({ issueKey, datasetId }: NavigationContext) => ({
        title: issueKey ? (
          <Link to={issuesIndexPath({ datasetId })}>Issues</Link>
        ) : (
          "Issues"
        ),
      }),
    }}
  >
    <Route index element={<IssuesIndexPage />} />
    <Route
      path=":issueKey"
      element={<IssueDetailsPage />}
      handle={{
        crumb: ({ issueKey }: NavigationContext) => ({ title: issueKey }),
      }}
    />
  </Route>
);
