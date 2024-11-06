/* Filters */
import ProductTypesFilter from "@/app/components/ClientSide/FilterPanel/ProductTypesFilter";

/* Icons */
import { SnippetsOutlined } from "@ant-design/icons";

/**
 * Creates an array of items for the Collapse component based on the available filters.
 *
 * @param {Object} data - The data with all the available filters.
 * @returns {Array} The array of items with the proper format for rendering a Collapse menu of Filters.
 */
export const filterMenuMaker = (data, onClose) => {
  const filterComponents = {
    product_types: {
      component: ProductTypesFilter,
      icon: <SnippetsOutlined />,
    },
  };

  return Object.keys(data)
    .map((key) => {
      const mapping = filterComponents[key];
      if (mapping) {
        const { component: Component, icon } = mapping;
        return {
          key: key,
          label: <>{icon} Tipo de producto bibliográfico</>,
          children: <Component key={key} data={data[key]} onClose={onClose} />,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
};
