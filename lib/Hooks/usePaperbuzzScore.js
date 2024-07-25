import { useState, useEffect } from "react";

/* API */
import { paperbuzzAPIRequest } from "@/lib/APIS/paperbuzzAPI";

/* Constants */
import { PAPERBUZZ_SOURCES_MULTIPLIER } from "../constants";

/**
 * Custom hook to calculate and retrieve the Paperbuzz score and tooltip information for a given DOI.
 *
 * @param {string} doi - The DOI (Digital Object Identifier) for which to calculate the Paperbuzz score.
 * @returns {Object} An object containing the Paperbuzz score and tooltip information.
 */
export default function usePaperbuzzScore(doi) {
  const [state] = paperbuzzAPIRequest(doi);
  const [score, setScore] = useState(0);
  const [tooltipInfo, setTooltipInfo] = useState([]);

  useEffect(() => {
    // Only proceed if the data is loaded and there are altmetrics sources available
    if (!state.isLoading && state.data?.altmetrics_sources) {
      let calculatedScore = 0;
      let infoData = [];

      // Calculate the score based on events count and predefined multipliers
      state.data.altmetrics_sources.forEach((source) => {
        calculatedScore +=
          source.events_count *
          (PAPERBUZZ_SOURCES_MULTIPLIER[source.source_id] || 0);

        // Exclude 'crossref' from tooltip info and gather necessary data
        if (source.source_id !== "crossref") {
          infoData.push({
            sourceId: source.source_id,
            iconUrl: source.source.icon_url,
            displayName: source.source.display_name,
            eventsCount: source.events_count,
          });
        }
      });

      // Handle the case where the only source is 'crossref'
      if (
        state.data.altmetrics_sources.length === 0 ||
        (state.data.altmetrics_sources.length === 1 &&
          state.data.altmetrics_sources[0].source_id === "crossref")
      ) {
        infoData = [{ sourceId: "no-info", displayName: "Sin información" }];
      }

      // Update state with the calculated score and tooltip info
      setScore(calculatedScore);
      setTooltipInfo(infoData);
    }
  }, [state.isLoading]); // Re-run effect if loading state changes

  return { score, tooltipInfo };
}
