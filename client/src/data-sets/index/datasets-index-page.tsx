import { DeleteOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";
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
import { RemoveDataSetModal } from "./remove-dataset-modal";

export const DataSetsIndexPage = () => {
  const [isAddDatasetModalOpen, setIsAddDatasetModalOpen] = useState(false);
  const showAddDatasetModal = () => setIsAddDatasetModalOpen(true);
  const hideAddDatasetModal = () => setIsAddDatasetModalOpen(false);

  const [datasetToRemove, setDatasetToRemove] = useState<DataSet>();

  const [loadingDataSetId, setLoadingDataSetId] = useState<string>();

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
        onClick={showAddDatasetModal}
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
                  disabled={loadingDataSetId !== undefined}
                  loading={
                    syncDataSet.isLoading && dataset.id === loadingDataSetId
                  }
                >
                  Sync
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => setDatasetToRemove(dataset)}
                />
              </Space>
            ),
          },
        ]}
      />

      <AddDataSetModal
        isOpen={isAddDatasetModalOpen}
        close={hideAddDatasetModal}
      />
      <RemoveDataSetModal
        dataset={datasetToRemove}
        isOpen={datasetToRemove !== undefined}
        close={() => setDatasetToRemove(undefined)}
      />
    </>
  );
};
