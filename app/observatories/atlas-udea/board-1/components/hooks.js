"use client";

/* Hooks */
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* lib */
import { CATEGORY_PARAM, DEFAULT_FILTERS, PAIR_LEVEL, parseCategories, serializeCategories, toggleCategory } from "@/lib/observatories/capacity";
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

/**
 * Categories that the scatter shows (F43c), kept in `?cat=` of the URL ([] = all). It is a view of the
 * panels 1 and 2, not a filter: it does not touch the filters, the other panels or the KPI. Only the
 * drawable categories are accepted (no production is not drawn).
 *
 * @param {string[]} drawable - Categories that can be isolated.
 * @returns {{ selected: string[], toggle: (category: string, additive?: boolean) => void, clear: () => void }}
 */
export function useCategorySelection(drawable) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState(() => parseCategories(searchParams.get(CATEGORY_PARAM)).filter((c) => drawable.includes(c)));
  /* The latest value, so that two quick clicks do not read a stale state. */
  const selectedRef = useRef(selected);

  const write = useCallback(
    (next) => {
      selectedRef.current = next;
      setSelected(next);
      const params = new URLSearchParams(window.location.search);
      params.delete("ocultas"); // the parameter of the hide mode (F43b) is dropped
      const value = serializeCategories(next);
      if (value) params.set(CATEGORY_PARAM, value);
      else params.delete(CATEGORY_PARAM);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname],
  );
  const toggle = useCallback((category, additive = false) => write(toggleCategory(selectedRef.current, category, additive)), [write]);
  const clear = useCallback(() => write([]), [write]);
  return { selected, toggle, clear };
}
