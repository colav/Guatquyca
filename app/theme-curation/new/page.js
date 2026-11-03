"use client";

/* Next */
import { useRouter } from "next/navigation";

/* APIs */
import { createTheme, getCandidates } from "@/lib/apis/theme.api";

/* Components */
import FlowHeader from "@/app/theme-curation/components/FlowHeader";
import SeedStep from "@/app/theme-curation/components/SeedStep";
import ReviewStep from "@/app/theme-curation/components/ReviewStep";
import SaveStep from "@/app/theme-curation/components/SaveStep";

/* Hooks */
import { useState } from "react";

/* Styles */
import styles from "@/app/theme-curation/styles.module.css";

/* Constants & utils */
import { TOPIC_COUNT_DEFAULT } from "@/app/theme-curation/lib/constants";
import { errorMessage } from "@/app/theme-curation/lib/errors";
import { persistAllTopics } from "@/app/theme-curation/lib/persist";

/**
 * ThemeCurationNewPage drives the full multi-step Theme Curation creation
 * flow ("Ingresar semilla" → "Revisar tópicos" → "Guardar eje") as a single client
 * component with shared state, mirroring the app/submit/page.js pattern:
 * one parent owns the flow state, children receive it via props.
 *
 * Lives at /theme-curation/new — the listing of already-curated themes
 * (Screen 4) took over the root /theme-curation route, so this wizard moved
 * to its own sibling route. Everything below is otherwise unchanged from
 * when this file WAS app/theme-curation/page.js.
 *
 * Classification (Screen 2) is kept entirely in this component's state and
 * is NOT sent to the backend as the curator classifies — PATCH/POST for
 * topics need a theme_id, which only exists after Screen 3 successfully
 * creates the theme (POST /app/theme, which also needs `curator`, only
 * collected on Screen 3). See lib/classification.js and lib/persist.js.
 *
 * @returns {JSX.Element}
 */
export default function ThemeCurationNewPage() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);

  const [name, setName] = useState("");
  const [seedText, setSeedText] = useState("");
  const [topicCount, setTopicCount] = useState(TOPIC_COUNT_DEFAULT);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [candidates, setCandidates] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  // True when /candidates reported it truncated the seed (`truncated: true`,
  // 01 D-008, deployed in B7). Absent only on a backend without D-008.
  const [truncated, setTruncated] = useState(false);

  const [manualTopics, setManualTopics] = useState([]);
  const [classifications, setClassifications] = useState({});

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [savedTheme, setSavedTheme] = useState(null);
  const [failedTopics, setFailedTopics] = useState([]);
  // Why the last attempt to save the topics failed as a whole (429, 5xx, no
  // connection, ...); null when it did not (01 D-052).
  const [failureReason, setFailureReason] = useState(null);

  const handleSearchCandidates = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await getCandidates({ seedText, topN: topicCount });
      setCandidates(result.data ?? []);
      setTotalResults(result.total_results ?? 0);
      setTruncated(result.truncated === true);
      setCurrent(1);
    } catch (e) {
      setError(
        errorMessage(
          e,
          "Ocurrió un error inesperado al buscar tópicos candidatos.",
          "candidates",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  // There's nothing to come back to on this route once a draft is
  // discarded — /theme-curation/new only exists to build a new theme —
  // so cancelling sends the curator back to the listing instead of just
  // clearing the form in place.
  const handleCancelSeed = () => {
    router.push("/theme-curation");
  };

  // A changed seed makes the last `truncated` answer stale, so the backend's
  // warning is dropped until the next search.
  const handleSeedTextChange = (value) => {
    setSeedText(value);
    setTruncated(false);
  };

  const handleClassify = (topicId, { status, justification }) => {
    setClassifications((prev) => ({
      ...prev,
      [topicId]: { status, justification },
    }));
  };

  const handleAddManualTopic = (topic) => {
    setManualTopics((prev) =>
      prev.some((t) => t.topic_id === topic.topic_id) ? prev : [...prev, topic],
    );
  };

  const handleBackToSeed = () => setCurrent(0);
  const handleBackToReview = () => setCurrent(1);
  const handleContinueToSave = () => setCurrent(2);

  const handleSaveTheme = async ({ curator, description }) => {
    setSaveError(null);
    setSaving(true);

    let themeResult;
    try {
      themeResult = await createTheme({ name, seedText, curator, description });
    } catch (e) {
      setSaveError(
        errorMessage(e, "No se pudo guardar el eje temático.", "createTheme"),
      );
      setSaving(false);
      return;
    }

    // The theme itself now exists — show the success view no matter what
    // happens next, so a failure persisting topics never hides that (and
    // never risks the curator re-submitting the form and creating a
    // second, orphaned theme).
    setSavedTheme(themeResult.data);

    try {
      const results = await persistAllTopics({
        themeId: themeResult.data.theme_id,
        candidates,
        manualTopics,
        classifications,
      });
      setFailedTopics(results.filter((r) => !r.ok));
      setFailureReason(null);
    } catch (e) {
      setFailureReason(
        errorMessage(e, "No se pudieron guardar los tópicos.", "other"),
      );
      // The bulk request itself failed outright (network/500/etc, not a
      // per-item rejection) — treat every topic that was going to be sent
      // as failed so "Reintentar" can recover them.
      const targeted = [...candidates, ...manualTopics].filter(
        (t) => classifications[t.topic_id]?.status,
      );
      setFailedTopics(
        targeted.map((t) => ({
          topicId: t.topic_id,
          ok: false,
          error: errorMessage(e, "No se pudo guardar este tópico."),
        })),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRetryFailedTopics = async () => {
    if (!savedTheme) return;
    setSaving(true);

    try {
      const retryIds = new Set(failedTopics.map((f) => f.topicId));
      const results = await persistAllTopics({
        themeId: savedTheme.theme_id,
        candidates: candidates.filter((t) => retryIds.has(t.topic_id)),
        manualTopics: manualTopics.filter((t) => retryIds.has(t.topic_id)),
        classifications,
      });
      setFailedTopics(results.filter((r) => !r.ok));
      setFailureReason(null);
    } catch (e) {
      // Leave failedTopics as-is — nothing recovered, but nothing lost
      // either; the Alert and "Reintentar" stay up for another attempt, now
      // with the reason of this failure.
      setFailureReason(
        errorMessage(e, "No se pudieron guardar los tópicos.", "other"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStartNewTheme = () => {
    setCurrent(0);
    setName("");
    setSeedText("");
    setTopicCount(TOPIC_COUNT_DEFAULT);
    setError(null);
    setCandidates([]);
    setTotalResults(0);
    setTruncated(false);
    setManualTopics([]);
    setClassifications({});
    setSaveError(null);
    setSavedTheme(null);
    setFailedTopics([]);
  };

  const handleGoToList = () => router.push("/theme-curation");

  const stepSubtitles = [
    "Describe el eje temático de investigación que quieres delimitar. El sistema buscará los tópicos de OpenAlex más relacionados.",
    `Eje: ${name || "(sin nombre)"} · ${totalResults} tópicos candidatos encontrados`,
    `Eje: ${name || "(sin nombre)"} · revisa el resumen antes de guardar`,
  ];

  return (
    <div className={styles.page}>
      <FlowHeader current={current} subtitle={stepSubtitles[current]} />

      {current === 0 && (
        <SeedStep
          name={name}
          onNameChange={setName}
          seedText={seedText}
          onSeedTextChange={handleSeedTextChange}
          topicCount={topicCount}
          onTopicCountChange={setTopicCount}
          onSubmit={handleSearchCandidates}
          onCancel={handleCancelSeed}
          loading={loading}
          error={error}
          truncated={truncated}
        />
      )}

      {current === 1 && (
        <ReviewStep
          candidates={candidates}
          manualTopics={manualTopics}
          classifications={classifications}
          truncated={truncated}
          onClassify={handleClassify}
          onAddManualTopic={handleAddManualTopic}
          onBack={handleBackToSeed}
          onContinue={handleContinueToSave}
        />
      )}

      {current === 2 && (
        <SaveStep
          name={name}
          onNameChange={setName}
          candidates={candidates}
          manualTopics={manualTopics}
          classifications={classifications}
          saving={saving}
          saveError={saveError}
          savedTheme={savedTheme}
          failedTopics={failedTopics}
          failureReason={failureReason}
          onSave={handleSaveTheme}
          onRetryFailedTopics={handleRetryFailedTopics}
          onStartNewTheme={handleStartNewTheme}
          onGoToList={handleGoToList}
          onBack={handleBackToReview}
        />
      )}
    </div>
  );
}
