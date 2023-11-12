import { Collapse } from "antd";
import { FC, ReactNode, useState } from "react";

export type ExpandableOptionsProps = {
  title: (isExpanded: boolean) => ReactNode;
  children: ReactNode;
};

export const ExpandableOptions: FC<ExpandableOptionsProps> = ({
  title,
  children,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>();
  return (
    <Collapse
      style={{ marginBottom: 8 }}
      bordered={false}
      size="small"
      onChange={(keys) => setExpandedKeys(keys as string[])}
      items={[
        {
          key: "dataset",
          label: title(!expandedKeys?.length),
          children,
        },
      ]}
    />
  );
};
