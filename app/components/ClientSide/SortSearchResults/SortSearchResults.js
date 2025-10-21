"use client";

/* lib */
import URLBuilder from "@/lib/Utils/URLBuilder";

/* Next */
import { useRouter, usePathname } from "next/navigation";

/* UI Library Components */
import { Select, Tooltip } from "antd";

/**
 * SortSearchResults is a client-side function component that displays a select input to sort the search results.
 *
 * @param {Object} searchParams - The search parameters. This is used to build the URL when the page changes.
 * @param {string} [type="entities"] - The type of search results to sort. Can be "patents", "projects", "works", or "entities".
 * @returns {JSX.Element} A Select component.
 */
export default function SortSearchResults({ searchParams, type = "entities" }) {
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (value) => {
    const URL = URLBuilder(pathname, searchParams, { sort: value });
    router.push(URL, { scroll: false });
  };

  const OPTIONS = {
    patents: [{ value: "alphabetical_asc", label: "Alfabético" }],
    projects: [{ value: "alphabetical_asc", label: "Alfabético" }],
    works: [
      { value: "citations_desc", label: "Más citado" },
      { value: "year_desc", label: "Más reciente" },
      { value: "alphabetical_asc", label: "Alfabético" },
    ],
    entities: [
      { value: "products_desc", label: "Mayor producción" },
      { value: "citations_desc", label: "Más citado" },
    ],
    news: [
      { value: "year_desc", label: "Más reciente" },
      { value: "alphabetical_asc", label: "Alfabético" },
    ],
  };

  return (
    <Tooltip title="Ordenar">
      <Select
        size="small"
        style={{ width: 155, marginLeft: "20px" }}
        value={searchParams.sort || "citations_desc"}
        onChange={onChange}
        options={OPTIONS[type]}
      />
    </Tooltip>
  );
}
