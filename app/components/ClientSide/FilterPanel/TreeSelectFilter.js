"use client";

/* Components */
import ApplyFilter from "./ApplyFilter";
import DeleteFilter from "./DeleteFilter";

/* Hooks */
import { useState } from "react";
import { useSearchParams } from "next/navigation";

/* UI Library Components */
import { Row, TreeSelect } from "antd";
import { TITLES } from "@/lib/constants";

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
    query.has(filterType) ? query.get(filterType)?.split(",") : null
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
        listHeight={400}
        placeholder={`Selecciona uno o más ${TITLES[filterType]}`}
        treeDefaultExpandAll={false}
        onChange={onChange}
        filterTreeNode={(inputValue, treeNode) =>
          treeNode.title.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
      <Row justify="end" style={{ marginTop: "12px" }}>
        <DeleteFilter filterType={filterType} queryParams={query} />
        <ApplyFilter value={value} filterType={filterType} query={query} />
      </Row>
    </>
  );
}
