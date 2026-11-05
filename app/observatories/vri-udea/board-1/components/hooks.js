"use client";

/* Hooks */
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* lib */
import { DEFAULT_FILTERS, PAIR_LEVEL } from "@/lib/observatories/capacity";
import {
  FILTER_DEBOUNCE_MS,
  FILTER_PARAM_NAMES,
  parseFilters,
  sameFilters,
  serializeFilters,
} from "@/lib/observatories/filters";

/* The confidence level of the axis–work pairs lives in `?pairs=all` (absent = high and medium, D-092). */
const PAIRS_PARAM = "pairs";
const readFilters = (params) => ({ ...parseFilters(params), pairLevel: params.get(PAIRS_PARAM) === PAIR_LEVEL.ALL ? PAIR_LEVEL.ALL : PAIR_LEVEL.CORE });
const same = (a, b) => sameFilters(a, b) && a.pairLevel === b.pairLevel;

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
  const [draft, setDraft] = useState(() => readFilters(searchParams));
  const [applied, setApplied] = useState(draft);

  useEffect(() => {
    if (same(draft, applied)) return undefined;
    const id = setTimeout(() => {
      setApplied(draft);
      /* Only the parameters of the filters change; others (such as `source`) stay in the URL. */
      const params = new URLSearchParams(window.location.search);
      [...FILTER_PARAM_NAMES, PAIRS_PARAM].forEach((name) => params.delete(name));
      new URLSearchParams(serializeFilters(draft)).forEach((value, name) => params.set(name, value));
      if (draft.pairLevel === PAIR_LEVEL.ALL) params.set(PAIRS_PARAM, PAIR_LEVEL.ALL);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, FILTER_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [draft, applied, pathname, router]);

  const update = useCallback((patch) => setDraft((d) => ({ ...d, ...patch })), []);
  const reset = useCallback(() => setDraft({ ...DEFAULT_FILTERS, pairLevel: PAIR_LEVEL.CORE }), []);

  return { draft, applied, pending: !same(draft, applied), update, reset };
}

/* useStableValue lives in the shared components of the observatories. */
export { useStableValue } from "@/app/observatories/components/useStableValue";
