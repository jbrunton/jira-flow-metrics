import { Empty, Form, Input, Modal, Select, Space, Spin, Tag } from "antd";
import { DataSource, useCreateDataset, useDataSources } from "@data/datasets";
import { useEffect, useState } from "react";

export type AddDatasetModalParams = {
  isOpen: boolean;
  close: () => void;
  domainId?: string;
};

export const AddDatasetModal: React.FC<AddDatasetModalParams> = ({
  isOpen,
  close,
  domainId,
}) => {
  const [form] = Form.useForm();

  const [dataSourceQuery, setDataSourceQuery] = useState<string>("");

  const { data: dataSources, isLoading: isLoadingDataSources } = useDataSources(
    domainId,
    dataSourceQuery,
  );

  const [dataSource, setDataSource] = useState<DataSource>();

  const createDataset = useCreateDataset();

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      createDataset.mutate(
        { domainId, dataset: { jql: dataSource?.jql, domainId, ...values } },
        {
          onSuccess: () => {
            form.resetFields();
          },
        },
      );
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
    if (createDataset.isSuccess) {
      close();
    }
  }, [createDataset.isSuccess, close]);

  const filterOption = (
    input: string,
    option: { label: string; value: string } | undefined,
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const notFoundContent = isLoadingDataSources ? (
    <Empty
      className="ant-empty-normal"
      image={<Spin style={{ margin: 0 }} size="large" />}
      description="Loading"
    />
  ) : dataSourceQuery.trim().length > 0 ? (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="No data sources found"
    />
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Type to search" />
  );

  return (
    <Modal
      title="Add Dataset"
      open={isOpen}
      onOk={onSubmit}
      onCancel={close}
      confirmLoading={createDataset.isLoading}
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
