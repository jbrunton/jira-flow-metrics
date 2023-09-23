import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddDataSetModal } from "./add-data-set-modal";
import { DataSet, useDataSets, useSyncDataSet } from "../../data/data-sets";

export const DataSetsIndexPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDataSetId, setLoadingDataSetId] = useState<string>();

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const { data: dataSets } = useDataSets();

  const dataSource = dataSets?.map(dataSet => ({
    key: dataSet.id,
    ...dataSet
  }));

  const syncDataSet = useSyncDataSet();

  const syncSelectedDataSet = (dataSet: DataSet) => {
    syncDataSet.mutate(dataSet.id);
    setLoadingDataSetId(dataSet.id);
  };

  useEffect(() => {
    if (!syncDataSet.isLoading) {
      setLoadingDataSetId(undefined);
    }
  }, [syncDataSet.isLoading, setLoadingDataSetId]);

  return <>
    <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: '16px' }}>
      Add Data Set
    </Button>

    <Table dataSource={dataSource} columns={[
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'JQL', dataIndex: 'jql', key: 'jql' },
      {
        key: 'actions', render: (_, dataSet) => (
          <Space size="large">
            <Link to={`/datasets/${dataSet.id}/scatterplot`}>Scatterplot</Link>
            <Link to={`/datasets/${dataSet.id}/issues`}>Issues</Link>
            <Button
              icon={<SyncOutlined />}
              onClick={() => syncSelectedDataSet(dataSet)}
              disabled={syncDataSet.isLoading}
              loading={syncDataSet.isLoading && dataSet.id === loadingDataSetId}
            >
              Sync
            </Button>
          </Space>
        )
      }
    ]} />

    <AddDataSetModal isOpen={isModalOpen} close={hideModal} />
  </>
}
