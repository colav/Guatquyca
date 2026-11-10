/**
 * Own texts of the interface for each failure when a board bundle is loaded (02 §3.11): the
 * `error` that the server sends is not shown. Provisional texts: Luis approves them.
 */
export const LOAD_ERROR_SUBTITLES = {
  network: "No se pudo conectar con el servicio de datos. Revise su conexión e inténtelo de nuevo.",
  notFound: "Este tablero no está disponible.",
  observatory_not_loaded: "Los datos del tablero aún no están cargados. Inténtelo más tarde.",
  observatory_not_configured: "El servicio de datos del observatorio no está configurado.",
  other: "Intente de nuevo en unos minutos.",
};

/**
 * Text for an error of the bundle request.
 *
 * @param {Error & { status?: number, code?: string, isNetwork?: boolean }} error
 * @returns {string}
 */
export function loadErrorSubtitle(error) {
  if (error.isNetwork) return LOAD_ERROR_SUBTITLES.network;
  if (error.code && LOAD_ERROR_SUBTITLES[error.code]) return LOAD_ERROR_SUBTITLES[error.code];
  if (error.status === 404) return LOAD_ERROR_SUBTITLES.notFound;
  return LOAD_ERROR_SUBTITLES.other;
}
