import { RouteObject, useMatches } from "react-router-dom";
import { useNavigationContext } from "./context";
import { useEffect } from "react";

export const Title = () => {
  const matches: RouteObject[] = useMatches();
  const navigationContext = useNavigationContext();

  const titles = matches
    .filter((match) => match.handle?.title)
    .map((match) =>
      typeof match.handle.title === "function"
        ? match.handle.title(navigationContext)
        : match.handle.title,
    )
    .reverse();

  const title = titles[0];

  useEffect(() => {
    if (title) {
      const pageTitle = Array.isArray(title) ? title.join(" | ") : title;
      document.title = `${pageTitle} | Jira Flow Metrics`;
    }
  }, [title]);

  if (title) {
    return <h1>{Array.isArray(title) ? title[0] : title}</h1>;
  }
};
