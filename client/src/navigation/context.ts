import { useLocation, useParams } from "react-router-dom";
import { Dataset, useDatasets } from "../data/datasets";
import { Domain, useDomains } from "../data/domains";

export type NavigationContext = {
  path: string;
  domains?: Domain[];
  domainId?: string;
  domain?: Domain;
  datasetId?: string;
  dataset?: Dataset;
  datasets?: Dataset[];
  issueKey?: string;
  reportKey?: string;
};

export const useNavigationContext = (): NavigationContext => {
  const { pathname: path } = useLocation();
  const { datasetId, domainId, issueKey, reportKey } = useParams();

  const { data: domains } = useDomains();
  const domain = domains?.find((domain) => domain.id === domainId);

  const { data: datasets } = useDatasets(domainId);
  const dataset = datasets?.find((dataset) => dataset.id === datasetId);

  return {
    domainId,
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
