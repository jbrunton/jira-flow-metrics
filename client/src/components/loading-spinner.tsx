import { Spin } from "antd";

export const LoadingSpinner = () => (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, 0)",
    }}
  >
    <Spin size="large" />
  </div>
);
