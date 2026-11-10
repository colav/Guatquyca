/* APIs */
import { getBoardBundle } from "@/lib/apis/observatory.api";

/* Constants & utils */
import { createDataset } from "../capacity/compute";

/** Route that serves the JSON embedded in the published Board 1 artifact ([mock], only with ?source=mock). */
export const BOARD_1_DATA_URL = "/observatories/vri-udea/board-1/data";

/** Value of `?source=` that asks for the local test data instead of the API. */
export const MOCK_SOURCE = "mock";

/**
 * Data adapter of Board 1. By default it reads the bundle from quyca (02 §3.11, phase B); with
 * `source: "mock"` it reads the artifact JSON that the local route serves from mock-data/.
 * Either way it returns the same dataset (see createDataset), so nothing else changes.
 *
 * @param {{ signal?: AbortSignal, source?: string }} [options]
 * @returns {Promise<{ dataset: Object, source: string }>} dataset and the source that was used
 * @throws {Error} With `status` (and `code`, or `isNetwork`) when the source fails.
 */
export async function loadBoard1Dataset({ signal, source } = {}) {
  if (source === MOCK_SOURCE) {
    const response = await fetch(BOARD_1_DATA_URL, { signal });
    if (!response.ok) {
      const error = new Error(`Board 1 data request failed with ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return { dataset: createDataset(await response.json()), source: MOCK_SOURCE };
  }
  return { dataset: createDataset(await getBoardBundle("vri-udea", 1, { signal })), source: "api" };
}
