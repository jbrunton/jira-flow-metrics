import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataSet, useDataSets } from "../data/data-sets";
import { Domain, useDomains } from "../data/domains";
import { useDomainContext } from "../domains/context";
import { DomainContextType } from "../domains/context/context";

export type NavigationContext = DomainContextType & {
  path: string;
  domains?: Domain[];
  domain?: Domain;
  dataSet?: DataSet;
  dataSets?: DataSet[];
};

export const useNavigationContext = (): NavigationContext => {
  const { pathname: path } = useLocation();
  const navigate = useNavigate();
  const { dataSetId } = useParams();

  const { domainId, setDomainId } = useDomainContext();
  const { data: domains } = useDomains();
  const domain = domains?.find((domain) => domain.id === domainId);

  const { data: dataSets } = useDataSets();
  const dataSet = dataSets?.find((dataSet) => dataSet.id === dataSetId);

  return {
    domainId,
    setDomainId: (domainId: string) => {
      setDomainId(domainId);
      navigate("/datasets");
    },
    path,
    domains,
    domain,
    dataSet,
    dataSets,
  };
};
