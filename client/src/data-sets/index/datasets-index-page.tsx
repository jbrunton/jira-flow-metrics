import { DeleteOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddDatasetModal } from "./add-dataset-modal";
import { Dataset, useSyncDataset } from "../../data/datasets";
import {
  issuesIndexPath,
  scatterplotPath,
  throughputPath,
  wipPath,
} from "../../navigation/paths";
import { RemoveDatasetModal } from "./remove-dataset-modal";
import { formatDate } from "../../lib/format";
import { useNavigationContext } from "../../navigation/context";

export const DatasetsIndexPage = () => {
  const [isAddDatasetModalOpen, setIsAddDatasetModalOpen] = useState(false);
  const showAddDatasetModal = () => setIsAddDatasetModalOpen(true);
  const hideAddDatasetModal = () => setIsAddDatasetModalOpen(false);

  const [datasetToRemove, setDatasetToRemove] = useState<Dataset>();

  const [loadingDatasetId, setLoadingDatasetId] = useState<string>();

  const { datasets, domain } = useNavigationContext();

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
      <h1>{domain?.host}</h1>
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
            title: "Reports",
            key: "reports",
            render: (_, dataset) => (
              <Space size="large">
                <Link to={scatterplotPath({ datasetId: dataset.id })}>
                  Scatterplot
                </Link>
                <Link to={throughputPath({ datasetId: dataset.id })}>
                  Throughput
                </Link>
                <Link to={wipPath({ datasetId: dataset.id })}>WIP</Link>
                <Link to={issuesIndexPath({ datasetId: dataset.id })}>
                  Issues{" "}
                  {dataset.lastSync ? (
                    <span>({dataset.lastSync.issueCount})</span>
                  ) : null}
                </Link>
              </Space>
            ),
          },
          {
            title: "Sync",
            key: "sync",
            render: (_, dataset) => (
              <Space size="large">
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
                {dataset.lastSync ? (
                  <span>Last synced: {formatDate(dataset.lastSync.date)}</span>
                ) : (
                  <span>Never</span>
                )}
              </Space>
            ),
          },
          {
            key: "actions",
            render: (_, dataset) => (
              <Space size="large">
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => setDatasetToRemove(dataset)}
                  disabled={loadingDatasetId !== undefined}
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
