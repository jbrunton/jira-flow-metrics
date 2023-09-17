import { useEffect, useState } from "react";
import { setDefaultDomainId } from "../../data/config";
import { invalidateDataSourceQueries } from "../../data/data-sets";
import { DomainContext } from "./context";

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
