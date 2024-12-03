/* Filters */
import CheckboxFilter from "@/app/components/ClientSide/FilterPanel/CheckboxFilter";
import TreeSelectFilter from "@/app/components/ClientSide/FilterPanel/TreeSelectFilter";
import YearRangeFilter from "@/app/components/ClientSide/FilterPanel/YearRangeFilter";

/* Icons */
import {
  CalendarOutlined,
  SnippetsOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { authors_ranking_icon } from "@/app/components/icons/authors_ranking";
import { groups_ranking_icon } from "@/app/components/icons/groups_ranking";
import { open_access_icon } from "@/app/components/icons/open_access";

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
    years: {
      component: YearRangeFilter,
      label: (
        <>
          <CalendarOutlined style={{ fontSize: "16px" }} /> Fecha de publicación
        </>
      ),
    },
    product_types: {
      component: TreeSelectFilter,
      label: (
        <>
          <SnippetsOutlined style={{ fontSize: "16px" }} /> Tipo de producto
          bibliográfico
        </>
      ),
    },
    subjects: {
      component: TreeSelectFilter,
      label: (
        <>
          <TagsOutlined style={{ fontSize: "16px" }} /> Temas
        </>
      ),
    },
    status: {
      component: CheckboxFilter,
      label: <>{open_access_icon({ color: "#064657" })} Ruta de acceso</>,
    },
    groups_ranking: {
      component: CheckboxFilter,
      label: (
        <>
          {groups_ranking_icon({ color: "#064657" })} Clasificación Minciencias
          del grupo
        </>
      ),
    },
    authors_ranking: {
      component: CheckboxFilter,
      label: (
        <>
          {authors_ranking_icon({ color: "#064657" })} Clasificación Minciencias
          del autor
        </>
      ),
    },
  };

  return Object.keys(data)
    .map((key) => {
      const mapping = filterComponents[key];
      if (mapping) {
        const { component: Component, label } = mapping;
        return {
          key: key,
          label: label,
          children: (
            <Component
              key={key}
              data={
                key === "subjects"
                  ? data[key].map((item) => ({ ...item, selectable: false }))
                  : data[key]
              }
              filterType={key}
            />
          ),
        };
      }
      return null;
    })
    .filter((item) => item !== null);
};
