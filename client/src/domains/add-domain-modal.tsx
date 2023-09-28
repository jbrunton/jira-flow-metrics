import { Form, Input, Modal } from "antd";
import { useCreateDomain } from "../data/domains";
import { useEffect } from "react";

export type AddDomainModalParams = {
  isOpen: boolean;
  close: () => void;
};

export const AddDomainModal: React.FC<AddDomainModalParams> = ({
  isOpen,
  close,
}) => {
  const [form] = Form.useForm();

  const createDomain = useCreateDomain();

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      createDomain.mutate(values);
    } catch (e) {
      // validation failed
    }
  };

  useEffect(() => {
    if (createDomain.isSuccess) {
      form.resetFields();
      close();
    }
  }, [createDomain.isSuccess, close, form]);

  return (
    <Modal
      title="Add Domain"
      open={isOpen}
      onOk={onSubmit}
      onCancel={close}
      confirmLoading={createDomain.isLoading}
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item name="host" label="Host" rules={[{ required: true }]}>
          <Input placeholder="example.atlassian.net" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="token" label="API Token" rules={[{ required: true }]}>
          <Input.Password type="password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
