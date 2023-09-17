import { Button, Divider, Select } from "antd";
import { Domain, useDomains } from "../data/domains"
import { useDomainContext } from "../domains/context";

export const DomainsDropdown = () => {
  const { data: domains } = useDomains();
  const { domainId, setDomainId } = useDomainContext();

  if (!domains) {
    return <Select style={{ width: 200 }} loading />
  }

  const options = getOptions(domains);

  const navigateToDomains = () => window.location.pathname = '/domains';

  return <>
    <Select
      style={{ width: 200 }}
      value={domainId}
      onChange={setDomainId}
      options={options}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: '5px 0' }} />
          <Button type="text" style={{ width: '100%' }} onClick={navigateToDomains}>Manage Domains</Button>
        </>
      )}
    />
  </>
}

const getLabel = (host: string): string => {
    try {
      const url = new URL(host);
      return url.host;
  } catch {
      return host;
  }
}

const getOptions = (domains: Domain[]) => {
    return domains.map(({ id, host }) => {
      const label = getLabel(host);
      return { value: id, label };
  })
}
