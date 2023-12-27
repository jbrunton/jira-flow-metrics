import { IssueFilter } from "@jbrunton/flow-metrics";
import { createContext } from "react";

export type FilterContextType = {
  filter: IssueFilter;
  setFilter: (filter: IssueFilter) => void;
};

export const FilterContext = createContext<FilterContextType>({
  filter: {},
  setFilter: () => {},
});
