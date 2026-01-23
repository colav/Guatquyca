"use client";

/* APIs */
import { APIRequest } from "@/lib/apis/client.api";

/* Hooks */
import { useState, useMemo } from "react";

/* UI Library Components */
import { AutoComplete, Input } from "antd";

/* Utils */
import autocompleteURLBuilder from "@/lib/utils/autocompleteURLBuilder";

const DEBOUNCE_DELAY = 300;

/* Simple debounce helper */
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * InstitutionSearch component
 *
 * Autocomplete input for searching and selecting institutions by name.
 * Fetches suggestions from the API and debounces requests for better UX.
 * Returns the selected institution and its ROR ID via the onSelect callback.
 *
 * @component
 * @param {Function} onSelect - Callback called with selected institution object ({ institution, ror_id })
 * @returns {JSX.Element} The autocomplete institution search input
 *
 * @example
 * <InstitutionSearch onSelect={({ institution, ror_id }) => { ... }} />
 */
export default function InstitutionSearch({ onSelect }) {
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
