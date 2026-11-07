"use client";

/* Hooks */
import { memo, useRef } from "react";

/* UI Library Components */
import { Select } from "antd";

/**
 * Select of a filter that only re-renders when its own options or value change (F75): the bar of filters re-renders with every
 * change of any filter, and with the lists of options with results most of the selects keep the same options and value.
 */
export const FilterSelect = memo(function FilterSelect({ options, value, placeholder, onChange, filterOption, optionRender, ...rest }) {
  return (
    <Select
      showSearch
      allowClear
      style={{ width: "100%" }}
      placeholder={placeholder}
      options={options}
      filterOption={filterOption}
      optionRender={optionRender}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
});

/**
 * Handlers that keep their identity between renders and call the latest function: `stable("key", fn)` returns the same function
 * for the same key, so the memoized selects do not re-render because of a new closure.
 */
export function useStableChange() {
  const latest = useRef({});
  const fns = useRef({});
  return (key, fn) => {
    latest.current[key] = fn;
    if (!fns.current[key]) fns.current[key] = (...args) => latest.current[key](...args);
    return fns.current[key];
  };
}
