import { createContext } from "react";

export type DomainContextType = {
  domainId: string | null;
  setDomainId: (domainId: string) => void;
}

export const DomainContext = createContext<DomainContextType>({
  domainId: null,
  setDomainId: () => {},
});
