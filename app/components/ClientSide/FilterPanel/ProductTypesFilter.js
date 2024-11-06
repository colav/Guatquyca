"use client";

/* Hooks */
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/* UI Library Components */
import { Button, Row, TreeSelect } from "antd";

/* Utils */
import URLBuilder from "@/lib/Utils/URLBuilder";
import { getQueryParamsAsObject } from "@/lib/Utils/getQueryParamsAsObject";
import applyFilterButtonChecker from "@/lib/Utils/applyFilterButtonChecker";

/**
 * ProductTypesFilter component allows users to filter products by type using a TreeSelect component.
 * The user can select multiple product types, including both parent and children nodes, and apply the
 * filter to see only the products that match the selected types.
 *
 * @param {Array} data - The tree data for the TreeSelect component.
 * @returns {JSX.Element} The ProductTypesFilter component.
 */
export default function ProductTypesFilter({ data, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const [value, setValue] = useState(
    query.has("product_type") ? query.get("product_type")?.split(",") : null
  );

  const onChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setValue(
      query.has("product_type") ? query.get("product_type")?.split(",") : null
    );
  }, [query]);

  /**
   * Handles the click event for the "apply filter" button, if no product type is selected, the button is disabled.
   * It overrides the product_type query parameter in the URL so that only the selected product types are shown.
   * Builds the URL with the selected product types and navigates to it.
   */
  const applyFilter = () => {
    onClose();
    const queryParams = getQueryParamsAsObject(query);
    const URL = URLBuilder(pathname, queryParams, {
      product_type: value.join(","),
    });
    if (value?.length) {
      router.push(URL);
    }
  };

  return (
    <>
      <TreeSelect
        treeData={data}
        treeLine
        multiple
        showSearch
        style={{ width: "100%" }}
        value={value}
        dropdownStyle={{ maxHeight: 600, overflow: "auto" }}
        placeholder="Selecciona uno o más tipos de productos"
        allowClear
        treeDefaultExpandAll={false}
        onChange={onChange}
        filterTreeNode={(inputValue, treeNode) =>
          treeNode.title.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
      <Row justify="end" style={{ marginTop: "20px" }}>
        <Button
          type="dashed"
          size="small"
          onClick={applyFilter}
          disabled={applyFilterButtonChecker(value, query, "product_type")}
        >
          Aplicar filtro
        </Button>
      </Row>
    </>
  );
}
