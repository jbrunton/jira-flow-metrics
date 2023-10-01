import { DeleteOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddDatasetModal } from "./add-dataset-modal";
import { Dataset, useDatasets, useSyncDataset } from "../../data/datasets";
import {
  issuesIndexPath,
  scatterplotPath,
  throughputPath,
} from "../../navigation/paths";
import { RemoveDatasetModal } from "./remove-dataset-modal";

export const DatasetsIndexPage = () => {
  const [isAddDatasetModalOpen, setIsAddDatasetModalOpen] = useState(false);
  const showAddDatasetModal = () => setIsAddDatasetModalOpen(true);
  const hideAddDatasetModal = () => setIsAddDatasetModalOpen(false);

  const [datasetToRemove, setDatasetToRemove] = useState<Dataset>();

  const [loadingDatasetId, setLoadingDatasetId] = useState<string>();

  const { data: datasets } = useDatasets();

  const dataSource = datasets?.map((dataset) => ({
    key: dataset.id,
    ...dataset,
  }));

  const syncDataset = useSyncDataset();

  const syncSelectedDataset = (dataset: Dataset) => {
    syncDataset.mutate(dataset.id);
    setLoadingDatasetId(dataset.id);
  };

  useEffect(() => {
    if (!syncDataset.isLoading) {
      setLoadingDatasetId(undefined);
    }
  }, [syncDataset.isLoading, setLoadingDatasetId]);

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
                  onClick={() => syncSelectedDataset(dataset)}
                  disabled={loadingDatasetId !== undefined}
                  loading={
                    syncDataset.isLoading && dataset.id === loadingDatasetId
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

      <AddDatasetModal
        isOpen={isAddDatasetModalOpen}
        close={hideAddDatasetModal}
      />
      <RemoveDatasetModal
        dataset={datasetToRemove}
        isOpen={datasetToRemove !== undefined}
        close={() => setDatasetToRemove(undefined)}
      />
    </>
  );
};
