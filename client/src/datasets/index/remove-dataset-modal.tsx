import { Modal, Typography } from "antd";
import { Dataset, useRemoveDataset } from "../../data/datasets";
import { useEffect } from "react";

export type RemoveDatasetModalParams = {
  isOpen: boolean;
  close: () => void;
  dataset?: Dataset;
};

export const RemoveDatasetModal: React.FC<RemoveDatasetModalParams> = ({
  isOpen,
  close,
  dataset,
}) => {
  const removeDataset = useRemoveDataset(dataset?.id);

  useEffect(() => {
    if (removeDataset.isSuccess) {
      close();
    }
  }, [removeDataset.isSuccess, close]);

  return (
    <Modal
      title="Remove dataset?"
      open={isOpen}
      onOk={() => removeDataset.mutate()}
      onCancel={close}
      confirmLoading={removeDataset.isLoading}
    >
      <p>
        Are you sure you want to remove the dataset{" "}
        <Typography.Text code>{dataset?.name}</Typography.Text>?
      </p>
    </Modal>
  );
};
