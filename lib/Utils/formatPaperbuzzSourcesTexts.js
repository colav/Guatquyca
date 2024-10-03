/**
 * Generates formatted text elements for various sources based on the event count and display name.
 * This function maps source identifiers to JSX elements that format the display of event counts
 * and names in a context-specific manner. If a source identifier does not match any key in the
 * predefined `sourceTexts` object, a default format is returned.
 *
 * @param {string} sourceId - The unique identifier for the source from which the event count originates.
 * @param {string} displayName - The display name of the source, used within the formatted text.
 * @param {number} eventsCount - The number of events associated with the source.
 * @returns {JSX.Element} A JSX element containing the formatted text for the specified source and event count.
 */
export default function formatPaperbuzzSourcesTexts(
  sourceId,
  displayName,
  eventsCount
) {
  const sourceTexts = {
    wikipedia: (
      <span>
        Referenciado en <b>{eventsCount}</b>{" "}
        {eventsCount === 1 ? "página" : "páginas"} de {displayName}.
      </span>
    ),
    datacite: (
      <span>
        Asociado con <b>{eventsCount}</b>{" "}
        {eventsCount === 1 ? "recurso" : "recursos"} de {displayName}.
      </span>
    ),
    twitter: (
      <span>
        Mencionado en <b>{eventsCount}</b>{" "}
        {eventsCount === 1 ? "tweet" : "tweets"} de X.
      </span>
    ),
    newsfeed: (
      <span>
        Mencionado en <b>{eventsCount}</b>{" "}
        {eventsCount === 1 ? "artículo" : "artículos"} de {displayName}.
      </span>
    ),
    wordpressdotcom: (
      <span>
        Mencionado en <b>{eventsCount}</b>{" "}
        {eventsCount === 1 ? "blog" : "blogs"} de {displayName}.
      </span>
    ),
    reddit: (
      <span>
        Mencionado en <b>{eventsCount}</b>{" "}
        {eventsCount === 1 ? "enlace" : "enlaces"} de Reddit.
      </span>
    ),
    "reddit-links": (
      <span>
        Mencionado en <b>{eventsCount}</b>{" "}
        {eventsCount === 1 ? "enlace" : "enlaces"} de Reddit-Links.
      </span>
    ),
    web: (
      <span>
        Mencionado en <b>{eventsCount}</b>{" "}
        {eventsCount === 1 ? "página" : "páginas"} web.
      </span>
    ),
    f1000: (
      <span>
        Mencionado <b>{eventsCount}</b> {eventsCount === 1 ? "vez" : "veces"} en{" "}
        {displayName}.
      </span>
    ),
    "cambia-lens": (
      <span>
        Mencionado <b>{eventsCount}</b> {eventsCount === 1 ? "vez" : "veces"} en
        The Lens.
      </span>
    ),
    facultyopinions: (
      <span>
        Mencionado <b>{eventsCount}</b> {eventsCount === 1 ? "vez" : "veces"} en
        Faculty Opinions.
      </span>
    ),
  };

  return (
    sourceTexts[sourceId] || (
      <span>
        Mencionado <b>{eventsCount}</b> {eventsCount === 1 ? "vez" : "veces"} en{" "}
        {displayName}.
      </span>
    )
  );
}
