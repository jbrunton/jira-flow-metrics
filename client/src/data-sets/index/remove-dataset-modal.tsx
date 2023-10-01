import { Modal, Typography } from "antd";
import { DataSet, useRemoveDataSet } from "../../data/datasets";
import { useEffect } from "react";

export type RemoveDataSetModalParams = {
  isOpen: boolean;
  close: () => void;
  dataset?: DataSet;
};

export const RemoveDataSetModal: React.FC<RemoveDataSetModalParams> = ({
  isOpen,
  close,
  dataset,
}) => {
  const removeDataset = useRemoveDataSet(dataset?.id);

  useEffect(() => {
    if (removeDataset.isSuccess) {
      close();
    }
  }, [removeDataset.isSuccess, close]);

  return (
    <Modal
      title="Remove Domain"
      open={isOpen}
      onOk={() => removeDataset.mutate()}
      onCancel={close}
      confirmLoading={removeDataset.isLoading}
    >
      <p>
        Are you sure you want to remove{" "}
        <Typography.Text code>{dataset?.name}</Typography.Text>?
      </p>
    </Modal>
  );
};
