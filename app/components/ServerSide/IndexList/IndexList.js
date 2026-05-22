/* Icons */
import { LineChartOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Tag } from "antd";

/**
 * IndexList
 *
 * Displays H and H5 indices when available. Returns null when neither index
 * is present.
 *
 * @param {number|null|undefined} h_index - H index value (may be 0)
 * @param {number|null|undefined} h5_index - H5 index value (may be 0)
 * @returns {JSX.Element|null} A fragment containing index tags or null.
 */
export default function IndexList({ h_index, h5_index }) {
  const hasIndexValues = h_index != null || h5_index != null;

  if (!hasIndexValues) {
    return null;
  }

  return (
    <>
      <div>
        <h2 style={{ margin: "0 0 5px 0", color: "gray" }}>
          <LineChartOutlined /> Índices:
        </h2>
      </div>
      <div style={{ marginTop: "8px" }}>
        {h_index != null && (
          <Tag style={{ fontSize: "14px" }}>
            <b>H:</b> {h_index}
          </Tag>
        )}
        {h5_index != null && (
          <Tag style={{ fontSize: "14px" }}>
            <b>H5:</b> {h5_index}
          </Tag>
        )}
      </div>
    </>
  );
}
