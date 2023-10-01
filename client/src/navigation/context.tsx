import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataSet, useDataSets } from "../data/datasets";
import { Domain, useDomains } from "../data/domains";
import { useDomainContext } from "../domains/context";
import { DomainContextType } from "../domains/context/context";
import { Issue, useIssues } from "../data/issues";

export type NavigationContext = DomainContextType & {
  path: string;
  domains?: Domain[];
  domain?: Domain;
  dataSetId?: string;
  dataset?: DataSet;
  dataSets?: DataSet[];
  issueKey?: string;
  issues?: Issue[];
  issue?: Issue;
};

export const useNavigationContext = (): NavigationContext => {
  const { pathname: path } = useLocation();
  const navigate = useNavigate();
  const { dataSetId, issueKey } = useParams();

  const { domainId, setDomainId } = useDomainContext();
  const { data: domains } = useDomains();
  const domain = domains?.find((domain) => domain.id === domainId);

  const { data: dataSets } = useDataSets();
  const dataset = dataSets?.find((dataset) => dataset.id === dataSetId);

  const { data: issues } = useIssues(dataSetId);
  const issue = issues?.find((issue) => issue.key === issueKey);

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
    dataSetId,
    dataSets,
    issueKey,
    issues,
    issue,
  };
};
