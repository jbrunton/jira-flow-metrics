import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Dataset, useDatasets } from "../data/datasets";
import { Domain, useDomains } from "../data/domains";
import { useDomainContext } from "../domains/context";
import { DomainContextType } from "../domains/context/context";

export type NavigationContext = DomainContextType & {
  path: string;
  domains?: Domain[];
  domain?: Domain;
  datasetId?: string;
  dataset?: Dataset;
  datasets?: Dataset[];
  issueKey?: string;
  reportKey?: string;
};

export const useNavigationContext = (): NavigationContext => {
  const { pathname: path } = useLocation();
  const navigate = useNavigate();
  const { datasetId, issueKey, reportKey } = useParams();

  const { domainId, setDomainId } = useDomainContext();
  const { data: domains } = useDomains();
  const domain = domains?.find((domain) => domain.id === domainId);

  const { data: datasets } = useDatasets();
  const dataset = datasets?.find((dataset) => dataset.id === datasetId);

  return {
    domainId,
    setDomainId: (domainId: string) => {
      setDomainId(domainId);
      navigate("/datasets");
    },
    path,
    domains,
    domain,
    dataset,
    datasetId,
    datasets,
    issueKey,
    reportKey,
  };
};
