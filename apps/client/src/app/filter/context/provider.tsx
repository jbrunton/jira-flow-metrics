import { useState } from "react";
import { HierarchyLevel } from "@entities/issues";
import { FilterContext } from "./context";
import { defaultDateRange } from "@lib/intervals";
import { IssueFilter } from "@data/issues";

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
