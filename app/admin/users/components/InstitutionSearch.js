"use client";

/* Hooks */
import { useState, useMemo } from "react";

/* Utils */
import autocompleteURLBuilder from "@/lib/utils/autocompleteURLBuilder";
import { APIRequest } from "@/lib/apis/client.api";

/* UI */
import { AutoComplete, Input } from "antd";

const DEBOUNCE_DELAY = 300;

/* Simple debounce helper */
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export default function InstitutionSearch({ value, onSelect }) {
  const [input, setInput] = useState("");
  const [suggestionsState, setSuggestionsUrl] = APIRequest("");

  const debouncedSetUrl = useMemo(
    () => debounce((url) => setSuggestionsUrl(url), DEBOUNCE_DELAY),
    [setSuggestionsUrl],
  );

  const handleSearch = (text) => {
    setInput(text);

    if (!text?.trim()) {
      setSuggestionsUrl("");
      return;
    }

    const url = autocompleteURLBuilder("institution", encodeURIComponent(text));

    text.length === 1 ? setSuggestionsUrl(url) : debouncedSetUrl(url);
  };

  const options = useMemo(() => {
    if (!suggestionsState.data) return [];

    return suggestionsState.data.map((item) => ({
      label: item.name,
      value: item._id, // ror_id
      institution: item.name,
      ror_id: item._id,
    }));
  }, [suggestionsState.data]);

  const handleSelect = (_, option) => {
    onSelect({
      institution: option.institution,
      ror_id: option.ror_id,
    });
    setInput(option.institution);
  };

  return (
    <AutoComplete
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      value={input}
      placeholder="Buscar institución"
      style={{ width: "100%" }}
    >
      <Input />
    </AutoComplete>
  );
}
