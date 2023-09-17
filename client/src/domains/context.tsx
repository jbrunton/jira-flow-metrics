import { createContext, useContext, useEffect, useState } from "react";
import { setDefaultDomainId } from "../data/config";
import { client } from "../client";
import { invalidateDataSourceQueries } from "../data/data-sets";

export type DomainContextType = {
  domainId: string | null;
  setDomainId: (domainId: string) => void;
}

// const createDefaultContext = (): DomainContextType => {
//   const domainId = localStorage.getItem('domainId');
//   return {
//     domainId,

//   }
// }

export const DomainContext = createContext<DomainContextType>({
  domainId: null,
  setDomainId: () => {},
});

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [domainId, setDomainId] = useState<string | null>(() => {
    const domainId = localStorage.getItem('domainId');
    if (domainId) {
      setDefaultDomainId(domainId);
    }
    return domainId;
  });

  useEffect(() => {
    if (domainId) {
      setDefaultDomainId(domainId);
      localStorage.setItem('domainId', domainId);
      invalidateDataSourceQueries();
    }
  }, [domainId]);

  return <DomainContext.Provider value={{ domainId, setDomainId }}>{children}</DomainContext.Provider>
}

export const useDomainContext = (): DomainContextType => {
  return useContext(DomainContext)
}
