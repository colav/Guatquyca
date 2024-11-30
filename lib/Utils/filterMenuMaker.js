/* Filters */
import ProductTypesFilter from "@/app/components/ClientSide/FilterPanel/ProductTypesFilter";
import StatusFilter from "@/app/components/ClientSide/FilterPanel/StatusFilter";
import YearRangeFilter from "@/app/components/ClientSide/FilterPanel/YearRangeFilter";

/* Icons */
import { CalendarTwoTone, SnippetsTwoTone } from "@ant-design/icons";
import { open_access_icon } from "@/app/components/icons/open_access";

import { setTwoToneColor } from "@ant-design/icons";

/* Utils */
import React from "react";

/**
 * Creates an array of items for the Collapse component based on the available filters.
 *
 * @param {Object} data - The data with all the available filters.
 * @returns {Array} The array of items with the proper format for rendering a Collapse menu of Filters.
 */
export const filterMenuMaker = (data) => {
  const filterComponents = {
    product_types: {
      component: ProductTypesFilter,
      label: (
        <>
          <SnippetsTwoTone style={{ fontSize: "16px" }} /> Tipo de producto
          bibliográfico
        </>
      ),
    },
    years: {
      component: YearRangeFilter,
      label: (
        <>
          <CalendarTwoTone style={{ fontSize: "16px" }} /> Fecha de publicación
        </>
      ),
    },
    status: {
      component: StatusFilter,
      label: <>{open_access_icon({ color: "#085f75" })} Ruta de acceso</>,
    },
  };

  setTwoToneColor("#085f75");

  return Object.keys(data)
    .map((key) => {
      const mapping = filterComponents[key];
      if (mapping) {
        const { component: Component, label } = mapping;
        return {
          key: key,
          label: label,
          children: <Component key={key} data={data[key]} />,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
};
