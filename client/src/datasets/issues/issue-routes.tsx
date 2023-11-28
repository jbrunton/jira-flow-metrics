import { Route } from "react-router-dom";
import { NavigationContext } from "../../navigation/context";
import { IssuesIndexPage } from "./issues-index/issues-index-page";
import { IssueDetailsPage } from "./issue-details/issue-details-page";
import { reportsCrumb } from "../components/reports-crumb";

export const issueRoutes = (
  <Route
    path="issues"
    handle={{
      crumb: ({ datasetId }: NavigationContext) =>
        reportsCrumb(datasetId, "issues"),
      title: () => "Issues",
    }}
  >
    <Route index element={<IssuesIndexPage />} />
    <Route
      path=":issueKey"
      element={<IssueDetailsPage />}
      handle={{
        crumb: ({ issueKey }: NavigationContext) => ({ title: issueKey }),
        title: ({ issueKey }: NavigationContext) => issueKey,
      }}
    />
  </Route>
);
