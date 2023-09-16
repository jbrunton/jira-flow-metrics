import { Button, Divider, Select } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { Domain, useDomains } from "../data/domains"
import { useState } from "react";
import { AddDomainModal } from "./add-domain-modal";

export const DomainsDropdown = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const { data: domains } = useDomains();
  
  if (!domains) {
    return <Select style={{ width: 200 }} loading />
  }

  const options = getOptions(domains);

  return <>
    <Select
      style={{ width: 200 }}
      defaultValue={domains[0].id}
      options={options}
      dropdownRender={(menu) => (
        <>
        {menu}
        <Divider style={{ margin: '5px 0' }} />
        <Button type="text" style={{ width: '100%' }} icon={<PlusOutlined />} onClick={showModal}>Add Domain</Button>
        </>
      )}
    />
    <AddDomainModal isOpen={isModalOpen} close={hideModal} />
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
