/* Filters */
import ProductTypesFilter from "@/app/components/ClientSide/FilterPanel/ProductTypesFilter";
import YearRangeFilter from "@/app/components/ClientSide/FilterPanel/YearRangeFilter";

/* Icons */
import { CalendarOutlined, SnippetsOutlined } from "@ant-design/icons";

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
          <SnippetsOutlined /> Tipo de producto bibliográfico
        </>
      ),
    },
    years: {
      component: YearRangeFilter,
      label: (
        <>
          <CalendarOutlined /> Fecha de publicación
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
          children: <Component key={key} data={data[key]} />,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
};
