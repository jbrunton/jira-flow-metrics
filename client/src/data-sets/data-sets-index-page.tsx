import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AddDataSetModal } from "./add-data-set-modal";
import { useDataSets, useSyncDataSet } from "../data/data-sets";

export const DataSetsIndexPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const { data: dataSets } = useDataSets();

  const dataSource = dataSets?.map(dataSet => ({
    key: dataSet.id,
    ...dataSet
  }));

  const syncDataSet = useSyncDataSet();

  return <>
    <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: '16px' }}>
      Add Data Set
    </Button>

    <Table dataSource={dataSource} columns={[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'JQL', dataIndex: 'jql', key: 'jql' },
      { key: 'actions', render: (_, dataSet) => (
        <Space size="large">
          <Link to={`/datasets/${dataSet.id}/metrics`}>Metrics</Link>
          <Link to={`/datasets/${dataSet.id}/issues`}>Issues</Link>
          <Button icon={<SyncOutlined />} onClick={() => syncDataSet.mutate(dataSet.id)} disabled={syncDataSet.isLoading} loading={syncDataSet.isLoading}>Sync</Button>
        </Space>
      )}
    ]} />

    <AddDataSetModal isOpen={isModalOpen} close={hideModal} />
  </>
}
