/* APIs */
import { getBoardBundle } from "@/lib/apis/observatory.api";

/* Constants & utils */
import { createFoundationsDataset } from "../foundations/compute";
import { MOCK_SOURCE } from "./artifactAdapter";

/** Route that serves the JSON of the published Board 3 artifact (`Tablero3_data.json`) ([mock], only with ?source=mock). */
export const BOARD_3_DATA_URL = "/observatories/vri-udea/board-3/data";

/**
 * Removes what no panel needs and must never reach the screen: the personal identifier of each
 * person of the arts table (`artes.prof[].id`). No other table of the artifact has names of people.
 * The bundle of quyca does not carry it (02 §3.11); the function keeps working on both.
 */
function withoutPersonalIdentifiers(raw) {
  return { ...raw, artes: { ...raw.artes, prof: raw.artes.prof.map(({ id, ...rest }) => rest) } };
}

/**
 * Data adapter of Board 3. By default it reads the bundle from quyca (02 §3.11, phase B); with
 * `source: "mock"` it reads the artifact JSON that the local route serves. The names of the fields
 * (positions of `P` and `A`) live in lib/observatories/foundations/constants.js, so the population
 * of the "profesores" cards can change there (D-106 Q11).
 *
 * @param {{ signal?: AbortSignal, source?: string }} [options]
 * @returns {Promise<{ dataset: Object, source: string }>} dataset and the source that was used
 * @throws {Error} With `status` (and `code`, or `isNetwork`) when the source fails.
 */
export async function loadBoard3Dataset({ signal, source } = {}) {
  if (source === MOCK_SOURCE) {
    const response = await fetch(BOARD_3_DATA_URL, { signal });
    if (!response.ok) {
      const error = new Error(`Board 3 data request failed with ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return { dataset: createFoundationsDataset(withoutPersonalIdentifiers(await response.json())), source: MOCK_SOURCE };
  }
  const bundle = await getBoardBundle("vri-udea", 3, { signal });
  /* The bundle marks a product without year with 0 and the artifact with null; the model reads null
     (they count in the totals and stay out of the series by year, F33). */
  for (const p of bundle.P) if (p[0] === 0) p[0] = null;
  return { dataset: createFoundationsDataset(withoutPersonalIdentifiers(bundle)), source: "api" };
}

export { withoutPersonalIdentifiers };
