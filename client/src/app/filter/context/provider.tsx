import { useState } from "react";
import { HierarchyLevel, IssueFilter } from "../../../data/issues";
import { FilterContext } from "./context";
import { defaultDateRange } from "../../../lib/intervals";

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filter, setFilter] = useState<IssueFilter>(() => {
    const dates = defaultDateRange();

    const filter: IssueFilter = {
      dates,
      hierarchyLevel: HierarchyLevel.Story,
    };

    return filter;
  });

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </FilterContext.Provider>
  );
};
