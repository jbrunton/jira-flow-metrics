import { useState } from "react";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { HierarchyLevel, IssueFilter } from "../../data/issues";
import { FilterContext } from "./context";

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filter, setFilter] = useState<IssueFilter>(() => {
    const today = new Date();
    const defaultStart = startOfDay(subDays(today, 30));
    const defaultEnd = endOfDay(today);

    const filter: IssueFilter = {
      dates: [defaultStart, defaultEnd],
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
