import { useContext } from "react";
import { DomainContext, DomainContextType } from "./context";

export const useDomainContext = (): DomainContextType => {
  return useContext(DomainContext);
};
