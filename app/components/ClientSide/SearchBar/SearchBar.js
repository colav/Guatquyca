"use client";

/* Constants */
import {
  OPTIONS,
  OPTIONS_INDEX,
  AFFILIATIONLIST,
  NO_AUTOCOMPLETE_TYPES,
} from "@/lib/constants";
const DEBOUNCE_DELAY = 300;
const SEARCH_CONFIG = {
  sortTypeMap: {
    default: "products_desc",
    works: "citations_desc",
    patents: "alphabetical_asc",
    projects: "alphabetical_asc",
    other_works: "alphabetical_asc",
  },
  defaultQueryParams: {
    max: "10",
    page: "1",
  },
};

/* Hooks */
import { useState, useCallback, useMemo } from "react";
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";

/* Icons */
import { BankOutlined, FileTextOutlined } from "@ant-design/icons";

/* lib */
import { APIRequest } from "@/lib/APIS/clientAPI";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { AutoComplete, Select, Input, ConfigProvider, Divider } from "antd";

/* UI library sub-components */
const { Search } = Input;

/* Utility Functions */
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * SearchBar is a client-side functional component that provides a search interface with autocomplete functionality.
 *
 * @component
 * @description This component allows users to search for various entities such as persons, institutions, and affiliations. It includes autocomplete suggestions, customizable search options, and a debounced API request for fetching suggestions.
 *
 * @param {string} selected - The currently selected search type (e.g., "person", "institution").
 * @param {string} searchInput - The current input value in the search bar.
 * @param {object} suggestionsState - The state object containing autocomplete suggestions fetched from the API.
 *
 * @returns {JSX.Element} A search bar with autocomplete and dropdown selection.
 */
export default function SearchBar() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // State
  const [selectedOption, setSelectedOption] = useState(() => getDefaultValue());
  const [searchInput, setSearchInput] = useState(
    searchParams.get("keywords") || ""
  );
  const [suggestionsState, setSuggestionsUrl] = APIRequest("");

  // Memoized debounced function
  const debouncedSetSuggestionsUrl = useMemo(
    () => debounce((url) => setSuggestionsUrl(url), DEBOUNCE_DELAY),
    [setSuggestionsUrl]
  );

  // Determine default select option
  function getDefaultValue() {
    if (params.entity) return OPTIONS[OPTIONS_INDEX[params.entity]];
    if (pathname.startsWith("/search")) {
      const type = pathname.split("/search/")[1]?.split("?")[0];
      return {
        label:
          type === "person" ? "Autor" : OPTIONS[OPTIONS_INDEX[type]]?.label,
        value: type,
        key: type,
      };
    }
    return OPTIONS[0];
  }

  // Handle search navigation
  const handleSearch = useCallback(
    (input) => {
      const isAffiliation = AFFILIATIONLIST.includes(selectedOption.value);
      const path = isAffiliation
        ? `/search/affiliations/${selectedOption.value}`
        : `/search/${selectedOption.value}`;

      const sortType =
        SEARCH_CONFIG.sortTypeMap[selectedOption.value] ||
        SEARCH_CONFIG.sortTypeMap.default;
      const queryParams = new URLSearchParams({
        ...SEARCH_CONFIG.defaultQueryParams,
        sort: sortType,
        ...(input && { keywords: input }),
      });

      router.push(`${path}?${queryParams.toString()}`);
    },
    [selectedOption.value, router]
  );

  // Handle autocomplete input
  const handleAutoComplete = useCallback(
    (input) => {
      setSearchInput(input);
      if (
        NO_AUTOCOMPLETE_TYPES.includes(selectedOption.value) ||
        !input?.trim()
      ) {
        debouncedSetSuggestionsUrl("");
        return;
      }

      const requestUrl =
        selectedOption.value === "person"
          ? `/app/completer/${selectedOption.value}/${encodeURIComponent(
              input
            )}`
          : `/app/completer/affiliations/${
              selectedOption.value
            }/${encodeURIComponent(input)}`;

      input.trim().length === 1
        ? setSuggestionsUrl(requestUrl)
        : debouncedSetSuggestionsUrl(requestUrl);
    },
    [selectedOption.value, debouncedSetSuggestionsUrl, setSuggestionsUrl]
  );

  // Build autocomplete options
  const autoCompleteOptions = useMemo(() => {
    if (
      NO_AUTOCOMPLETE_TYPES.includes(selectedOption.value) ||
      !searchInput.trim() ||
      !suggestionsState.data
    ) {
      return [];
    }

    const renderOption = (item, index, array) => {
      const isLast = index === array.length - 1;

      if (selectedOption.value === "person") {
        return {
          label: (
            <Link
              href={`/${selectedOption.value}/${item._id}/research/products?max=10&page=1&sort=citations_desc`}
            >
              <div className={styles.label_container}>
                <span className={styles.label}>{item.full_name}</span>
                <span className={styles.subtitles}>
                  <FileTextOutlined /> {item._source.products_count}
                </span>
              </div>
              {item._source?.affiliations?.[0]?.name && (
                <div className={styles.subtitles}>
                  <BankOutlined /> {item._source.affiliations[0].name}.
                </div>
              )}
              {!isLast && <Divider className={styles.margin_0} />}
            </Link>
          ),
          value: item._id,
        };
      }

      const href = `/affiliation/${selectedOption.value}/${item._id}/affiliations`;
      return {
        label: (
          <Link href={href}>
            <div>
              <span>{item.name}</span>
              {selectedOption.value !== "institution" &&
                item._source?.relations?.length && (
                  <div className={styles.subtitles}>
                    <BankOutlined />{" "}
                    {selectedOption.value === "faculty"
                      ? item._source?.relations?.[0]
                      : item._source.relations.join(", ")}
                    .
                  </div>
                )}
            </div>
            {!isLast && <Divider className={styles.margin_0} />}
          </Link>
        ),
        value: item._id,
      };
    };

    return suggestionsState.data.map(renderOption);
  }, [searchInput, suggestionsState.data, selectedOption.value]);

  // Component configuration
  const selectTheme = {
    token: { borderRadius: 0 },
    components: {
      Select: {
        fontSize: 15,
        optionPadding: "3px 6px",
        optionHeight: 24,
        selectorBg: "#f7f7f7",
        singleItemHeightLG: 40,
      },
    },
  };

  // Event handlers
  const handleSelect = useCallback(
    (value) => {
      setSearchInput("");
      const path =
        selectedOption.value === "person"
          ? `/${selectedOption.value}/${value}/research/products?max=10&page=1&sort=citations_desc`
          : `/affiliation/${selectedOption.value}/${value}/affiliations`;
      router.push(path);
    },
    [router, selectedOption.value]
  );
  const onChangeSelect = (value) => {
    setSelectedOption(value);
    setSearchInput("");
    setSuggestionsUrl("");
  };

  let notFoundContent = null;
  if (!NO_AUTOCOMPLETE_TYPES.includes(selectedOption.value)) {
    if (searchInput.trim() && autoCompleteOptions.length === 0) {
      notFoundContent = "No se encontraron resultados para la búsqueda.";
    }
  }

  return (
    <div id={styles.searchbar}>
      <ConfigProvider theme={selectTheme}>
        <Select
          size="large"
          options={OPTIONS}
          labelInValue
          value={selectedOption}
          onChange={onChangeSelect}
          popupMatchSelectWidth={215}
          listHeight={380}
        />
      </ConfigProvider>
      <ConfigProvider theme={{ token: { borderRadius: 0, fontSize: 16 } }}>
        <AutoComplete
          style={{ marginLeft: -1, flex: 1, height: 40 }}
          popupClassName={styles.autocomplete}
          onSearch={handleAutoComplete}
          onSelect={handleSelect}
          options={autoCompleteOptions}
          notFoundContent={notFoundContent}
          value={searchInput}
        >
          <Search
            size="large"
            placeholder="Búsqueda por palabra clave"
            onSearch={handleSearch}
            enterButton
          />
        </AutoComplete>
      </ConfigProvider>
    </div>
  );
}
