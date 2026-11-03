"use client";

/* APIs */
import { searchTopics } from "@/lib/apis/theme.api";

/* Styles */
import styles from "../styles.module.css";

/* Hooks */
import { useMemo, useRef, useState } from "react";

/* Constants & utils */
import {
  BAD_REQUEST_MESSAGES,
  MANUAL_ADD_NOTICE_SECONDS,
  MANUAL_RESULTS_LIST_HEIGHT,
  MANUAL_SEARCH_EMPTY_MESSAGE,
  MANUAL_SEARCH_PLACEHOLDER,
  SELECTION_MAX_HEIGHT,
  SELECTION_MAX_HEIGHT_SMALL,
  manualAddNotice,
} from "../lib/constants";
import { errorMessage } from "../lib/errors";
import { hierarchyPath } from "../lib/format";

/* Icons */
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";

/* UI Library Components */
import {
  AutoComplete,
  Button,
  Input,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";

const { Text } = Typography;

const DEBOUNCE_DELAY = 300;

/* Simple debounce helper, same pattern as InstitutionSearch.js */
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * ManualTopicSearch is the "Buscar tópico en inglés..." control from
 * Screen 2: a debounced lexical search (GET /app/theme/search) against the
 * full topic catalog, for topics the embedding search didn't surface.
 *
 * Clicking a result adds it to a selection that accumulates across
 * searches (01 D-050): while the dropdown is open it is listed in a strip at
 * its top with the title "Seleccionados (N)" (01 D-052), each topic with its
 * full name and an "x" to remove it; the strip scrolls on its own past a
 * maximum height. With the dropdown closed, a tag inside the search box says
 * how many are waiting ("N seleccionados") and reopens it (01 D-055). A second click on a
 * chosen result removes it. Results already in the Screen 2 table read "Ya agregado" and
 * cannot be chosen. The dropdown stays open while choosing. The
 * "Agregar N tópicos" button (at the foot of the dropdown, always visible;
 * there is no other add button) sends the whole selection to the review table
 * as unclassified topics — the curator still classifies them with the same
 * inline status buttons as any other row, so there's only one place in the
 * UI that knows how to set a classification — empties the selection and
 * shows a notice for MANUAL_ADD_NOTICE_SECONDS seconds. Nothing is written to
 * the backend until "Guardar".
 *
 * @param {Set<string>} existingTopicIds - topic_ids already in the table (candidates + manual); they cannot be chosen again.
 * @param {function} onAdd - Called with the full topic object, once per selected topic, when the curator adds the selection.
 * @returns {JSX.Element}
 */
export default function ManualTopicSearch({ existingTopicIds, onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  // Topics chosen so far, in the order they were chosen; kept across searches.
  const [selected, setSelected] = useState([]);
  // Text for a failed search (see lib/errors.js); null when the last search
  // worked, so an empty list reads as "no results" only for a 200.
  const [searchError, setSearchError] = useState(null);
  // Set while a click on a result is being handled, so the dropdown stays
  // open and the search box text is not reset by the component.
  const choosingRef = useRef(false);
  const [messageApi, messageHolder] = message.useMessage();

  const runSearch = async (q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    setSearchError(null);
    try {
      const res = await searchTopics({ q, limit: 20 });
      setResults(res.data ?? []);
    } catch (err) {
      setResults([]);
      setSearchError(errorMessage(err, BAD_REQUEST_MESSAGES.search, "search"));
    } finally {
      setSearching(false);
    }
  };

  const debouncedSearch = useMemo(
    () => debounce(runSearch, DEBOUNCE_DELAY),
    [],
  );

  const handleSearchInput = (text) => {
    if (choosingRef.current) return;
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      setSearchError(null);
      return;
    }
    text.length === 1 ? runSearch(text) : debouncedSearch(text);
  };

  const isSelected = (topicId) => selected.some((t) => t.topic_id === topicId);

  const handleChoose = (topic) => {
    choosingRef.current = true;
    setSelected((prev) =>
      prev.some((t) => t.topic_id === topic.topic_id)
        ? prev.filter((t) => t.topic_id !== topic.topic_id)
        : [...prev, topic],
    );
    // Let the component finish its own select handling (it tries to close
    // the dropdown and clear the text) before search input is read again.
    setTimeout(() => {
      choosingRef.current = false;
    }, 0);
  };

  const handleRemove = (topicId) =>
    setSelected((prev) => prev.filter((t) => t.topic_id !== topicId));

  const handleAddSelection = () => {
    if (selected.length === 0) return;
    selected.forEach((topic) => onAdd(topic));
    messageApi.success({
      content: manualAddNotice(selected.length),
      duration: MANUAL_ADD_NOTICE_SECONDS,
    });
    setSelected([]);
    setQuery("");
    setResults([]);
    setSearchError(null);
    setOpen(false);
  };

  // The full topic name wraps instead of being cut; the hierarchy and the
  // keywords live in a tooltip, shown on hover, each under its own label, and
  // parts the topic lacks are omitted (no tooltip when it has neither).
  const options = results.map((topic) => {
    const alreadyAdded = existingTopicIds.has(topic.topic_id);
    const chosen = isSelected(topic.topic_id);
    const path = hierarchyPath(topic);
    const keywords = (topic.keywords ?? "")
      .split(";")
      .map((k) => k.trim())
      .filter(Boolean)
      .join(", ");
    const details =
      path || keywords ? (
        <div>
          {path && (
            <div>
              <strong>Jerarquía:</strong> {path}
            </div>
          )}
          {keywords && (
            <div style={path ? { marginTop: 4 } : undefined}>
              <strong>Palabras clave:</strong> {keywords}
            </div>
          )}
        </div>
      ) : null;
    return {
      value: topic.topic_id,
      topic,
      disabled: alreadyAdded,
      label: (
        <Tooltip title={details} placement="right" mouseEnterDelay={0.2}>
          <div
            className={styles.manualResultRow}
            style={{ opacity: alreadyAdded ? 0.5 : 1 }}
          >
            <span className={styles.manualResultName}>{topic.name}</span>
            {chosen && (
              <CheckOutlined
                aria-label="Elegido"
                className={styles.manualResultCheck}
              />
            )}
            {alreadyAdded && (
              <Text type="secondary" style={{ fontSize: 12, flexShrink: 0 }}>
                Ya agregado
              </Text>
            )}
          </div>
        </Tooltip>
      ),
    };
  });

  const addLabel = `Agregar ${selected.length} ${
    selected.length === 1 ? "tópico" : "tópicos"
  }`;

  // The chosen topics, as removable tags, in a scrolling box (the maximum
  // heights are CSS variables so the small-screen value can use a media query).
  const selectionTags = (ariaLabel) => (
    <div
      className={styles.manualSelection}
      aria-label={ariaLabel}
      style={{
        "--selection-max-height": `${SELECTION_MAX_HEIGHT}px`,
        "--selection-max-height-small": `${SELECTION_MAX_HEIGHT_SMALL}px`,
      }}
    >
      {selected.map((topic) => (
        <Tag
          key={topic.topic_id}
          closable
          onClose={() => handleRemove(topic.topic_id)}
          className={styles.manualSelectionTag}
        >
          {topic.name}
        </Tag>
      ))}
    </div>
  );

  // Dropdown: strip of chosen topics on top (title and tags), the results in
  // the middle and the add button at the foot, which does not scroll.
  const renderPopup = (menu) => (
    <div className={styles.manualPopup}>
      {selected.length > 0 && (
        <div className={styles.manualPopupStrip}>
          <div className={styles.manualPopupTitle}>
            <Text strong>{`Seleccionados (${selected.length})`}</Text>
          </div>
          {selectionTags("Tópicos seleccionados en el desplegable")}
        </div>
      )}
      {menu}
      <div className={styles.manualPopupFooter}>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          disabled={selected.length === 0}
          onClick={handleAddSelection}
          block
        >
          {addLabel}
        </Button>
      </div>
    </div>
  );

  // Chosen topics waiting to be added: with the dropdown closed they are not
  // visible, so the search box carries a small tag with their count that
  // opens the dropdown (01 D-055).
  const pendingLabel = `${selected.length} ${
    selected.length === 1 ? "seleccionado" : "seleccionados"
  }`;
  const pendingTag =
    selected.length > 0 ? (
      <Tag
        color="blue"
        role="button"
        tabIndex={0}
        className={styles.manualPendingTag}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {pendingLabel}
      </Tag>
    ) : null;

  // Nothing to show in the list: with chosen topics the dropdown still opens
  // (strip and add button); an empty element keeps antd from hiding it.
  const notFound = searching ? (
    "Buscando..."
  ) : searchError ? (
    searchError
  ) : query.trim() ? (
    MANUAL_SEARCH_EMPTY_MESSAGE
  ) : selected.length > 0 ? (
    <span aria-hidden="true" />
  ) : null;

  return (
    <div className={styles.manualSearch}>
      {messageHolder}
      <AutoComplete
        style={{ width: "100%" }}
        options={options}
        value={query}
        open={open}
        onOpenChange={(next) => {
          // A click on a result asks to close the dropdown; keep it open.
          if (!next && choosingRef.current) return;
          setOpen(next);
        }}
        onSearch={handleSearchInput}
        onSelect={(_, option) => handleChoose(option.topic)}
        popupClassName={styles.manualSearchPopup}
        virtual={false}
        listHeight={MANUAL_RESULTS_LIST_HEIGHT}
        popupRender={renderPopup}
        notFoundContent={notFound}
      >
        <Input placeholder={MANUAL_SEARCH_PLACEHOLDER} suffix={pendingTag} />
      </AutoComplete>
    </div>
  );
}
