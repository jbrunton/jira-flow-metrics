import { RouteObject, useMatches } from "react-router-dom";
import { useNavigationContext } from "./context";

export const Title = () => {
  const matches: RouteObject[] = useMatches();
  const navigationContext = useNavigationContext();

  const titles = matches
    .filter((match) => match.handle?.title)
    .map((match) => match.handle.title(navigationContext))
    .reverse();

  if (titles.length) {
    return <h1>{titles[0]}</h1>;
  }
};
