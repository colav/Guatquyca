/* Hooks */
import { usePathname, useRouter } from "next/navigation";

/* UI Library Components */
import { Button } from "antd";

/* Utils */
import applyFilterButtonChecker from "@/lib/Utils/applyFilterButtonChecker";
import { getQueryParamsAsObject } from "@/lib/Utils/getQueryParamsAsObject";
import URLBuilder from "@/lib/Utils/URLBuilder";

/**
 * ApplyFilter component provides a button to apply a specific filter to the query parameters.
 *
 * @param {Array} value - The selected filter values.
 * @param {Function} onClose - The function to call when closing the filter.
 * @param {string} filterType - The type of filter to apply.
 * @param {URLSearchParams} query - The current query parameters.
 * @returns {JSX.Element} The ApplyFilter component.
 */
export default function ApplyFilter({ value, onClose, filterType, query }) {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Handles the click event for the "apply filter" button, if no filter is selected, the button is disabled.
   * It overrides the filterType query parameter in the URL so that only the selected filters are shown.
   * Builds the URL with the selected filter and navigates to it.
   */
  const onClick = () => {
    onClose();
    const queryParams = getQueryParamsAsObject(query);
    const URL = URLBuilder(pathname, queryParams, {
      [filterType]: value.join(","),
    });
    if (value?.length) {
      router.push(URL);
    }
  };

  return (
    <Button
      type="dashed"
      size="small"
      onClick={onClick}
      disabled={applyFilterButtonChecker(value, query, filterType)}
    >
      Aplicar filto
    </Button>
  );
}
