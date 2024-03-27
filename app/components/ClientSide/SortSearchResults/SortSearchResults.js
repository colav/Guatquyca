"use client";

/* lib */
import URLBuilder from "@/lib/URLBuilder";

/* Next */
import { useRouter, usePathname } from "next/navigation";

/* UI Library Components */
import { Select } from "antd";

/**
 * SortSearchResults is a "client-side" function component that displays a select input to sort the search results.
 *
 * @param {Object} searchParams - The search parameters. This is used to build the URL when the page changes.
 * @param {boolean} works - A boolean to determine if the search results are works or entities.
 * @returns {JSX.Element} A Select component.
 */
export default function SortSearchResults({ searchParams, works = false }) {
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (value) => {
    const URL = URLBuilder(pathname, searchParams, { sort: value });
    router.push(URL);
  };

  const OPTIONS = {
    works: [
      { value: "citations", label: "Más citado" },
      { value: "year", label: "Más reciente" },
    ],
    entities: [
      { value: "citations", label: "Más citado" },
      { value: "products", label: "Mayor producción" },
    ],
  };

  return (
    <Select
      size="small"
      style={{ width: 155, marginLeft: "20px" }}
      value={searchParams.sort || "citations"}
      onChange={onChange}
      options={works ? OPTIONS.works : OPTIONS.entities}
    />
  );
}
