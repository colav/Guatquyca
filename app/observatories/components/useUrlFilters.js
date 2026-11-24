"use client";

/* Hooks */
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Filters of a board with immediate application (no "Aplicar" button): the controls change
 * `draft` at once and, after `debounceMs` without more changes, `applied` (what the board
 * computes) and the URL are updated. The URL keeps only what differs from the defaults.
 *
 * @param {{ defaults: Object, parse: Function, serialize: Function, same: Function, debounceMs: number }} config
 * @returns {{ draft: Object, applied: Object, pending: boolean, update: Function, reset: Function }}
 */
export function useUrlFilters({ defaults, parse, serialize, same, debounceMs }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [draft, setDraft] = useState(() => parse(searchParams));
  const [applied, setApplied] = useState(draft);

  useEffect(() => {
    if (same(draft, applied)) return undefined;
    const id = setTimeout(() => {
      setApplied(draft);
      /* Only the parameters of the filters change; others (such as `source`) stay in the URL. */
      const params = new URLSearchParams(window.location.search);
      new URLSearchParams(serialize(applied)).forEach((_value, name) => params.delete(name));
      new URLSearchParams(serialize(draft)).forEach((value, name) => params.set(name, value));
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, debounceMs);
    return () => clearTimeout(id);
  }, [draft, applied, pathname, router, debounceMs, same, serialize]);

  const update = useCallback((patch) => setDraft((d) => ({ ...d, ...patch })), []);
  const reset = useCallback(() => setDraft({ ...defaults }), [defaults]);

  return { draft, applied, pending: !same(draft, applied), update, reset };
}
