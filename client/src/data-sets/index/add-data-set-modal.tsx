import { Empty, Form, Input, Modal, Select, Space, Tag } from "antd";
import {
  DataSource,
  useCreateDataSet,
  useDataSources,
} from "../../data/data-sets";
import { useEffect, useState } from "react";

export type AddDataSetModalParams = {
  isOpen: boolean;
  close: () => void;
  domainId?: string;
};

export const AddDataSetModal: React.FC<AddDataSetModalParams> = ({
  isOpen,
  close,
  domainId,
}) => {
  const [form] = Form.useForm();

  const [dataSourceQuery, setDataSourceQuery] = useState<string>("");

  const { data: dataSources } = useDataSources(dataSourceQuery);

  const [dataSource, setDataSource] = useState<DataSource>();

  const createDataSet = useCreateDataSet();

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      createDataSet.mutate({ jql: dataSource?.jql, domainId, ...values });
      form.resetFields();
    } catch (e) {
      // validation failed
    }
  };

  const onSelectDataSource = (value: string) => {
    if (!dataSources) {
      return;
    }

    const dataSource = dataSources[parseInt(value, 10)];
    setDataSource(dataSource);

    form.setFieldValue("name", dataSource.name);
  };

  useEffect(() => {
    if (createDataSet.isSuccess) {
      close();
    }
  }, [createDataSet.isSuccess, close]);

  const filterOption = (
    input: string,
    option: { label: string; value: string } | undefined,
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const notFoundContent =
    dataSourceQuery.trim().length > 0 ? (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No data sources found"
      />
    ) : (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Type to search"
      />
    );

  return (
    <Modal
      title="Add Domain"
      open={isOpen}
      onOk={onSubmit}
      onCancel={close}
      confirmLoading={createDataSet.isLoading}
    >
      <Form form={form}>
        <Form.Item
          name="data-source"
          label="Data source"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            onSearch={setDataSourceQuery}
            onChange={onSelectDataSource}
            filterOption={filterOption}
            notFoundContent={notFoundContent}
          >
            {dataSources?.map((dataSource, index) => (
              <Select.Option value={index} label={dataSource.name} key={index}>
                <Space>
                  {dataSource.type === "project" ? (
                    <Tag color="blue">project</Tag>
                  ) : (
                    <Tag color="orange">filter</Tag>
                  )}
                  {dataSource.name}
                </Space>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
