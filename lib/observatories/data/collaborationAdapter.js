/* Constants & utils */
import { createCollaborationDataset } from "../collaboration/compute";

/** [mock] Route that serves the JSON embedded in the published Board 2 artifact (plus `funders`). */
export const BOARD_2_DATA_URL = "/observatories/vri-udea/board-2/data";

/**
 * Data adapter of Board 2. It returns the dataset in the shape of the artifact JSON (window.T2);
 * phase B replaces the source (ClickHouse through the API) by changing only this function.
 *
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<Object>} dataset (see createCollaborationDataset)
 * @throws {Error} With `status` when the source answers an error.
 */
export async function loadBoard2Dataset({ signal } = {}) {
  const response = await fetch(BOARD_2_DATA_URL, { signal });
  if (!response.ok) {
    const error = new Error(`Board 2 data request failed with ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return createCollaborationDataset(await response.json());
}
