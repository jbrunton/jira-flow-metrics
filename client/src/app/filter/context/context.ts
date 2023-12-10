import { createContext } from "react";
import { IssueFilter } from "../../../data/issues";

export type FilterContextType = {
  filter: IssueFilter;
  setFilter: (filter: IssueFilter) => void;
};

export const FilterContext = createContext<FilterContextType>({
  filter: {},
  setFilter: () => {},
});
