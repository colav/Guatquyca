"use client";

/* Constants */
import { OPTIONS, OPTIONS_INDEX, AFFILIATIONLIST } from "@/lib/constants";

/* Next */
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";

/* React */
import { useState } from "react";

/* UI Components */
import { Select, Input, ConfigProvider } from "antd";

/* UI Sub-components */
const { Search } = Input;

/**
 * `SearchBar` is a client-side functional component.
 *
 * @returns {JSX.Element} A search bar component.
 *
 * This component renders a search bar with a select dropdown before it. The select dropdown contains options
 * for different search types, and the search bar allows the user to enter a search query.
 *
 * The `getDefaultValue` function determines the default value of the select dropdown based on the `params`
 * and `pathname` values.
 *
 * The `selectBefore` variable contains the JSX for the select dropdown. The `onSelect` prop is set to the
 * `setSelected` function, which updates the `selected` state variable.
 *
 * The `searchRequest` function constructs the URL for the search request based on the `selected`
 * value and the input from the search bar. It then uses the `router.push` method to navigate to the constructed URL.
 */
export default function SearchBar() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const getDefaultValue = () => {
    if (params.entity) {
      return OPTIONS[OPTIONS_INDEX[params.entity]];
    }
    if (pathname.slice(0, 7) === "/search") {
      const type = pathname.split("/search/")[1].split("?")[0];
      return {
        label: type === "person" ? "Autor" : OPTIONS[OPTIONS_INDEX[type]].label,
        value: type,
        key: type,
      };
    }
    return OPTIONS[0];
  };

  const [selected, setSelected] = useState(getDefaultValue());

  const selectBefore = (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            optionPadding: "3px 6px",
            optionHeight: 24,
          },
        },
      }}
    >
      <Select
        options={OPTIONS}
        labelInValue="true"
        defaultValue={getDefaultValue()}
        onSelect={setSelected}
        popupMatchSelectWidth={215}
        listHeight={380}
      />
    </ConfigProvider>
  );

  const searchRequest = (input) => {
    const getPath = (value) => {
      return AFFILIATIONLIST.includes(value)
        ? `/search/affiliations/${value}`
        : `/search/${value}`;
    };

    const sortTypeMap = {
      works: "citations_desc",
      patents: "alphabetical_asc",
      projects: "alphabetical_asc",
      other_works: "alphabetical_asc",
      default: "products_desc",
    };

    const getQueryParams = (value, input) => {
      const sortType = sortTypeMap[value] || sortTypeMap.default;
      const keywords = input ? `&keywords=${input}` : "";
      return `?max=10&page=1&sort=${sortType}${keywords}`;
    };

    const path = getPath(selected.value);
    const queryParams = getQueryParams(selected.value, input);

    router.push(`${path}${queryParams}`);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 4,
          controlHeight: 42,
          colorFillAlter: "#fafafa",
          fontSize: 16,
        },
      }}
    >
      <Search
        addonBefore={selectBefore}
        placeholder={"Búsqueda por palabra clave"}
        onSearch={(input) => searchRequest(input)}
        enterButton
        defaultValue={searchParams.get("keywords") || ""}
      />
    </ConfigProvider>
  );
}
