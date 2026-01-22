/* Constants */
import { FILTERS_ORDER } from "../constants";

/* Filters */
import CheckboxFilter from "@/app/components/ClientSide/Filters/CheckboxFilter";
import CountrySelectFilter from "@/app/components/ClientSide/Filters/CountrySelectFilter";
import SelectFilter from "@/app/components/ClientSide/Filters/SelectFilter";
import TreeSelectFilter from "@/app/components/ClientSide/Filters/TreeSelectFilter";
import YearRangeFilter from "@/app/components/ClientSide/Filters/YearRangeFilter";

/* Icons */
import {
  CalendarOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  FieldTimeOutlined,
  NumberOutlined,
  ReadOutlined,
  SnippetsOutlined,
  TagsOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { authors_ranking_icon } from "@/app/components/icons/authors_ranking";
import { groups_ranking_icon } from "@/app/components/icons/groups_ranking";
import { open_access_icon } from "@/app/components/icons/open_access";

/* Utils */
import React from "react";
import SliderFilter from "@/app/components/ClientSide/Filters/SliderFilter";

/**
 * Creates an array of items for the Collapse component based on the available filters.
 *
 * @param {Object} data - The data with all the available filters.
 * @returns {Array} The array of items with the proper format for rendering a Collapse menu of Filters.
 */
export const filterMenuMaker = (data) => {
  const orderedKeys = FILTERS_ORDER.filter((key) => key in data);

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
        </>
      ),
    },
    subjects: {
      component: TreeSelectFilter,
      label: (
        <>
          <TagsOutlined style={{ fontSize: "16px" }} /> Temas "Subjects"
        </>
      ),
    },
    topics: {
      component: SelectFilter,
      label: (
        <>
          <TagsOutlined style={{ fontSize: "16px" }} /> Tópicos
        </>
      ),
    },
    countries: {
      component: CountrySelectFilter,
      label: (
        <>
          <EnvironmentOutlined style={{ fontSize: "15px" }} /> País
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
    scimago_quartiles: {
      component: CheckboxFilter,
      label: (
        <>
          <NumberOutlined style={{ fontSize: "15px" }} /> Mejor cuartil de
          SCImago
        </>
      ),
    },
    source_types: {
      component: SelectFilter,
      label: (
        <>
          <ReadOutlined style={{ fontSize: "16px" }} /> Tipos de fuentes
        </>
      ),
    },
    publication_time: {
      component: SliderFilter,
      label: (
        <>
          <FieldTimeOutlined style={{ fontSize: "16px" }} /> Tiempo promedio de
          publicación (semanas)
        </>
      ),
    },
    apc_range: {
      component: SliderFilter,
      label: (
        <>
          <DollarCircleOutlined style={{ fontSize: "16px" }} /> Pago de APC
          (USD)
        </>
      ),
    },
    license_type: {
      component: SelectFilter,
      label: (
        <>
          <UnlockOutlined style={{ fontSize: "16px" }} /> Tipo de licencia
        </>
      ),
    },
  };

  return orderedKeys
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
