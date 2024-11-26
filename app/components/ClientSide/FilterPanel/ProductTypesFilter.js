"use client";

/* Components */
import ApplyFilter from "./ApplyFilter";
import DeleteFilter from "./DeleteFilter";

/* Hooks */
import { useState } from "react";
import { useSearchParams } from "next/navigation";

/* UI Library Components */
import { Row, TreeSelect } from "antd";

/**
 * ProductTypesFilter component allows users to filter products by type using a TreeSelect component.
 * The user can select multiple product types, including both parent and children nodes, and apply the
 * filter to see only the products that match the selected types.
 *
 * @param {Array} data - The tree data for the TreeSelect component.
 * @returns {JSX.Element} The ProductTypesFilter component.
 */
export default function ProductTypesFilter({ data }) {
  const query = useSearchParams();
  const [value, setValue] = useState(
    query.has("product_type") ? query.get("product_type")?.split(",") : null
  );

  const onChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <TreeSelect
        size="small"
        treeData={data}
        treeLine
        multiple
        showSearch
        style={{ width: "100%" }}
        value={value}
        listHeight={450}
        placeholder="Selecciona uno o más tipos de productos"
        treeDefaultExpandAll={false}
        onChange={onChange}
        filterTreeNode={(inputValue, treeNode) =>
          treeNode.title.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
      <Row justify="end" style={{ marginTop: "20px" }}>
        <DeleteFilter filterType="product_type" queryParams={query} />
        <ApplyFilter value={value} filterType="product_type" query={query} />
      </Row>
    </>
  );
}
