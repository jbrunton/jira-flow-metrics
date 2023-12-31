import { LoadingSpinner } from "@app/components/loading-spinner";
import { Dataset, UpdateDatasetParams, useUpdateDataset } from "@data/datasets";
import { Button, Form, Input } from "antd";
import { FC, useState } from "react";
import { WorkflowBoard } from "@jbrunton/flow-components";

export type EditDatasetFormProps = {
  dataset?: Dataset;
  onClose: () => void;
};

export const EditDatasetForm: FC<EditDatasetFormProps> = ({
  dataset,
  onClose,
}) => {
  const [updatedWorkflow, setUpdatedWorkflow] =
    useState<UpdateDatasetParams["workflow"]>();

  const updateDataset = useUpdateDataset();

  if (!dataset) {
    return <LoadingSpinner />;
  }

  const applyChanges = () => {
    if (updatedWorkflow) {
      updateDataset.mutate(
        {
          id: dataset.id,
          name: dataset.name,
          workflow: updatedWorkflow,
        },
        {
          onSuccess: onClose,
        },
      );
    }
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Name">
        <Input value={dataset.name} />
      </Form.Item>
      <Form.Item label="Workflow" style={{ overflowX: "auto" }}>
        <WorkflowBoard
          dataset={dataset}
          onWorkflowChanged={(workflow) =>
            setUpdatedWorkflow(
              workflow.map((stage) => ({
                ...stage,
                statuses: stage.statuses.map((status) => status.name),
              })),
            )
          }
          disabled={updateDataset.isLoading}
        />
      </Form.Item>
      <Button
        type="primary"
        onClick={applyChanges}
        loading={updateDataset.isLoading}
        disabled={updatedWorkflow === undefined || updateDataset.isLoading}
      >
        Apply Changes
      </Button>
    </Form>
  );
};
