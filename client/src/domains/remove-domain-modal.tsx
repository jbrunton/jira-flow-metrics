import { Modal, Typography } from "antd";
import { useEffect } from "react";
import { Domain, useRemoveDomain } from "../data/domains";

export type RemoveDomainModalParams = {
  isOpen: boolean;
  close: () => void;
  domain?: Domain;
};

export const RemoveDomainModal: React.FC<RemoveDomainModalParams> = ({
  isOpen,
  close,
  domain,
}) => {
  const removeDataset = useRemoveDomain(domain?.id);

  useEffect(() => {
    if (removeDataset.isSuccess) {
      close();
    }
  }, [removeDataset.isSuccess, close]);

  return (
    <Modal
      title="Remove domain?"
      open={isOpen}
      onOk={() => removeDataset.mutate()}
      onCancel={close}
      confirmLoading={removeDataset.isLoading}
    >
      <p>
        Are you sure you want to remove the domain{" "}
        <Typography.Text code>{domain?.host}</Typography.Text>?
      </p>
    </Modal>
  );
};
