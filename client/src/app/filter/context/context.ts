import { IssueFilter } from "@data/issues";
import { createContext } from "react";

export type FilterContextType = {
  filter: IssueFilter;
  setFilter: (filter: IssueFilter) => void;
};

export const FilterContext = createContext<FilterContextType>({
  filter: {},
  setFilter: () => {},
});
