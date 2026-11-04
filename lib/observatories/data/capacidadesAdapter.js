/* Constants & utils */
import { createFoundationsDataset } from "../foundations/compute";

/** [mock] Route that serves the JSON of the published Board 3 artifact (`Tablero3_data.json`). */
export const BOARD_3_DATA_URL = "/observatories/vri-udea/board-3/data";

/**
 * Removes what no panel needs and must never reach the screen: the personal identifier of each
 * person of the arts table (`artes.prof[].id`). No other table of the artifact has names of people.
 */
function withoutPersonalIdentifiers(raw) {
  return { ...raw, artes: { ...raw.artes, prof: raw.artes.prof.map(({ id, ...rest }) => rest) } };
}

/**
 * Data adapter of Board 3. It returns the dataset in the shape of the artifact JSON; phase B
 * replaces the source (ClickHouse through the API) by changing only this function. The names of the
 * fields (positions of `P` and `A`) live in lib/observatories/foundations/constants.js, so the
 * population of the "profesores" cards can change there (D-106 Q11).
 *
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<Object>} dataset (see createFoundationsDataset)
 * @throws {Error} With `status` when the source answers an error.
 */
export async function loadBoard3Dataset({ signal } = {}) {
  const response = await fetch(BOARD_3_DATA_URL, { signal });
  if (!response.ok) {
    const error = new Error(`Board 3 data request failed with ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return createFoundationsDataset(withoutPersonalIdentifiers(await response.json()));
}

export { withoutPersonalIdentifiers };
