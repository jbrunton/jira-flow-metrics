import { Button, Table } from "antd";
import { useDomains } from "../data/domains";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { AddDomainModal } from "./add-domain-modal";
import { Link } from "react-router-dom";
import { datasetsIndexPath } from "../navigation/paths";

export const DomainsIndexPage = () => {
  const { data: domains } = useDomains();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const dataSource = domains?.map((domain) => ({
    key: domain.id,
    ...domain,
  }));

  return (
    <>
      <h1>Jira domains</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        style={{ marginBottom: "16px" }}
      >
        Add Domain
      </Button>
      <Table
        dataSource={dataSource}
        columns={[
          { title: "Host", dataIndex: "host", key: "host" },
          {
            title: "Credentials",
            dataIndex: "credentials",
            key: "credentials",
          },
          {
            key: "actions",
            render: (_, domain) => (
              <Link to={datasetsIndexPath({ domainId: domain.id })}>
                Explore
              </Link>
            ),
          },
        ]}
      />
      <AddDomainModal isOpen={isModalOpen} close={hideModal} />
    </>
  );
};
