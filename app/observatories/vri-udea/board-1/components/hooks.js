"use client";

/* Hooks */
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* lib */
import { DEFAULT_FILTERS } from "@/lib/observatories/capacity";
import {
  FILTER_DEBOUNCE_MS,
  parseFilters,
  sameFilters,
  serializeFilters,
} from "@/lib/observatories/filters";

/**
 * Filters of the board with immediate application (no "Aplicar" button): the controls change
 * `draft` at once and, after FILTER_DEBOUNCE_MS without more changes, `applied` (what the board
 * computes) and the URL are updated. The URL keeps only what differs from the defaults.
 *
 * @returns {{ draft: Object, applied: Object, pending: boolean, update: Function, reset: Function }}
 */
export function useBoardFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [draft, setDraft] = useState(() => parseFilters(searchParams));
  const [applied, setApplied] = useState(draft);

  useEffect(() => {
    if (sameFilters(draft, applied)) return undefined;
    const id = setTimeout(() => {
      setApplied(draft);
      const query = serializeFilters(draft);
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, FILTER_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [draft, applied, pathname, router]);

  const update = useCallback((patch) => setDraft((d) => ({ ...d, ...patch })), []);
  const reset = useCallback(() => setDraft({ ...DEFAULT_FILTERS }), []);

  return { draft, applied, pending: !sameFilters(draft, applied), update, reset };
}

/**
 * Returns the previous reference while the value has the same content, so a memoized chart only
 * redraws when its own data changed (the whole result is recomputed on every filter change).
 *
 * @param {*} value - JSON-serializable value.
 * @returns {*}
 */
export function useStableValue(value) {
  const ref = useRef({ key: null, value });
  const key = JSON.stringify(value);
  if (ref.current.key !== key) ref.current = { key, value };
  return ref.current.value;
}
