import { useContext } from "react";
import { FilterContext, FilterContextType } from "./context";

export const useFilterContext = (): FilterContextType => {
  return useContext(FilterContext);
};
