/* UI Library Components */
import { Tooltip } from "antd";

export default function InvisibleContainer({ source }) {
  if (!source) {
    return null;
  }
  return (
    <Tooltip title={`Fuente: ${source || null}`}>
      <div
        style={{
          width: "102px",
          height: "30px",
          position: "absolute",
          zIndex: "1000",
          marginTop: "8px",
        }}
      ></div>
    </Tooltip>
  );
}
