/* Constants & utils */
import { createDataset } from "../capacity/compute";

/** [mock] Route that serves the JSON embedded in the published Board 1 artifact. */
export const BOARD_1_DATA_URL = "/observatories/vri-udea/board-1/data";

/**
 * Data adapter of Board 1. It returns the dataset in the shape of the artifact JSON; phase B
 * replaces the source (ClickHouse through the API) by changing only this function.
 *
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<Object>} dataset (see createDataset)
 * @throws {Error} With `status` when the source answers an error.
 */
export async function loadBoard1Dataset({ signal } = {}) {
  const response = await fetch(BOARD_1_DATA_URL, { signal });
  if (!response.ok) {
    const error = new Error(`Board 1 data request failed with ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return createDataset(await response.json());
}
