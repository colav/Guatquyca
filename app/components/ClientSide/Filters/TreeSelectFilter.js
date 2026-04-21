"use client";

/* Components */
import ApplyFilter from "./ApplyFilter";
import DeleteFilter from "./DeleteFilter";

/* Hooks */
import { useState } from "react";
import { useSearchParams } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Row, TreeSelect, Col, Tag, ConfigProvider } from "antd";
import { TITLES } from "@/lib/constants";

/* Utils */
import { coarFilterFormatter } from "@/lib/utils/coarFilterFormatter";
import { formatNumber } from "@/lib/utils/formatNumber";

/**
 * TreeSelectFilter is a client-side functional component that provides a tree-select filter
 * for selecting multiple items, parents and children.
 * It allows users to apply and delete filters based on the selected items.
 *
 * @param {Array} data - The tree data for the TreeSelect component.
 * @param {string} filterType - The type of filter to apply.
 * @returns {JSX.Element} The TreeSelectFilter component.
 */
export default function TreeSelectFilter({ data, filterType }) {
  if (!data.length)
    return "No hay datos para este filtro con los criterios previamente seleccionados.";
  const query = useSearchParams();
  const [value, setValue] = useState(
    query.has(filterType) ? query.get(filterType)?.split(",") : null,
  );

  if (filterType === "product_types") {
    data = coarFilterFormatter(data);
  }

  const onChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            TreeSelect: {
              indentSize: 6,
            },
          },
        }}
      >
        <TreeSelect
          size="small"
          treeData={data}
          treeLine
          multiple
          showSearch
          style={{ width: "100%" }}
          value={value}
          listHeight={400}
          placeholder={`Selecciona uno o más ${TITLES[filterType]}`}
          treeDefaultExpandAll={false}
          onChange={onChange}
          filterTreeNode={(inputValue, treeNode) =>
            treeNode.title.toLowerCase().includes(inputValue.toLowerCase())
          }
          treeTitleRender={(nodeData) => (
            <Row justify="space-between" style={{ width: "100%" }}>
              <Col xs={19} md={20} className={styles.optionLabel}>
                {nodeData.title}
              </Col>
              {typeof nodeData.count !== "undefined" && (
                <Tag bordered={false} style={{ marginRight: 2 }}>
                  {formatNumber(nodeData.count)}
                </Tag>
              )}
            </Row>
          )}
        />
        <Row justify="end" style={{ marginTop: 12 }}>
          <DeleteFilter filterType={filterType} queryParams={query} />
          <ApplyFilter value={value} filterType={filterType} query={query} />
        </Row>
      </ConfigProvider>
    </>
  );
}
