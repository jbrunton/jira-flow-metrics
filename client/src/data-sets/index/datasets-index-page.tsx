import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddDataSetModal } from "./add-dataset-modal";
import { DataSet, useDataSets, useSyncDataSet } from "../../data/datasets";
import {
  issuesIndexPath,
  scatterplotPath,
  throughputPath,
} from "../../navigation/paths";

export const DataSetsIndexPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDataSetId, setLoadingDataSetId] = useState<string>();

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const { data: datasets } = useDataSets();

  const dataSource = datasets?.map((dataset) => ({
    key: dataset.id,
    ...dataset,
  }));

  const syncDataSet = useSyncDataSet();

  const syncSelectedDataSet = (dataset: DataSet) => {
    syncDataSet.mutate(dataset.id);
    setLoadingDataSetId(dataset.id);
  };

  useEffect(() => {
    if (!syncDataSet.isLoading) {
      setLoadingDataSetId(undefined);
    }
  }, [syncDataSet.isLoading, setLoadingDataSetId]);

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        style={{ marginBottom: "16px" }}
      >
        Add Data Set
      </Button>

      <Table
        dataSource={dataSource}
        columns={[
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "JQL", dataIndex: "jql", key: "jql" },
          {
            key: "actions",
            render: (_, dataset) => (
              <Space size="large">
                <Link to={scatterplotPath({ datasetId: dataset.id })}>
                  Scatterplot
                </Link>
                <Link to={throughputPath({ datasetId: dataset.id })}>
                  Throughput
                </Link>
                <Link to={issuesIndexPath({ datasetId: dataset.id })}>
                  Issues
                </Link>
                <Button
                  icon={<SyncOutlined />}
                  onClick={() => syncSelectedDataSet(dataset)}
                  disabled={syncDataSet.isLoading}
                  loading={
                    syncDataSet.isLoading && dataset.id === loadingDataSetId
                  }
                >
                  Sync
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <AddDataSetModal isOpen={isModalOpen} close={hideModal} />
    </>
  );
};
