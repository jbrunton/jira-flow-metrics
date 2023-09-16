import { Button, Table } from "antd";
import { useDomains } from "../data/domains";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { AddDomainModal } from "../components/add-domain-modal";
import { Link } from "react-router-dom";

export const DomainsPage = () => {
  const { data: domains } = useDomains();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const dataSource = domains?.map(domain => ({
    key: domain.id,
    ...domain
  }));

  return <>
    <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: '16px' }}>
      Add Domain
    </Button>
    <Table dataSource={dataSource} columns={[
      { title: 'Host', dataIndex: 'host', key: 'host' },
      { key: 'actions', render: (_, domain) => <Link to={`/domains/${domain.id}`}>Projects</Link> }
    ]} />
    <AddDomainModal isOpen={isModalOpen} close={hideModal} />
  </>
}
