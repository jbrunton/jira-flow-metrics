import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AddDataSetModal } from "./add-data-set-modal";
import { useDataSets } from "../data/data-sets";

export const DataSetsIndexPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { domainId } = useParams();
  console.info({ domainId })

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const { data: dataSets } = useDataSets(domainId);

  const dataSource = dataSets?.map(dataSet => ({
    key: dataSet.id,
    ...dataSet
  }));

  return <>
    <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: '16px' }}>
      Add Data Set
    </Button>

    <Table dataSource={dataSource} columns={[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'JQL', dataIndex: 'jql', key: 'jql' },
      { key: 'actions', render: (_, dataSet) => (
        <Space size="large">
          <Link to={`/datasets/${domainId}/${dataSet.id}/metrics`}>Metrics</Link>
          <Link to={`/datasets/${domainId}/${dataSet.id}/issues`}>Issues</Link>
        </Space>
      )}
    ]} />

    <AddDataSetModal isOpen={isModalOpen} close={hideModal} domainId={domainId} />
  </>
}
