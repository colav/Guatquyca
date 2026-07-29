/* Utilities */
// import getData from "@/lib/apis/server.api";
// import URLBuilder from "@/lib/utils/URLBuilder";

/**
 * Capa de acceso a datos de boletines (newsletter).
 *
 * Hoy en día los datos se cargan desde archivos JSON locales en
 * `lib/Data/newsletter`. Cuando el backend esté listo, basta con
 * descomentar los bloques marcados como "API real" y eliminar el
 * bloque "Mock local" en cada función. Ningún componente que consuma
 * estas funciones necesita cambiar.
 */

/**
 * Retorna el listado de boletines (resumen, sin el contenido markdown).
 *
 * @returns {Promise<Array<{slug: string, title: string, publishedAt: string, excerpt?: string}>>}
 */
export async function getNewsletterList() {
  // ---- API real (cuando el backend esté listo) ----
  // const URL = URLBuilder("/app/newsletter", {});
  // const { data } = await getData(URL);
  // return data.data;

  // ---- Mock local ----
  try {
    const data = (await import("../Data/index.json")).default;
    return data;
  } catch (e) {
    console.error("No se pudo cargar el listado de boletines", e);
    return [];
  }
}

/**
 * Retorna el detalle de un boletín específico, incluyendo el contenido en markdown.
 *
 * @param {string} slug
 * @returns {Promise<{slug: string, title: string, publishedAt: string, content: string} | null>}
 */
export async function getNewsletterBySlug(slug) {
  // ---- API real (cuando el backend esté listo) ----
  // const URL = URLBuilder(`/app/newsletter/${slug}`, {});
  // try {
  //   const { data } = await getData(URL);
  //   return data;
  // } catch (e) {
  //   return null;
  // }

  // ---- Mock local ----
  try {
    const data = (await import(`../Data/${slug}.json`)).default;
    return data;
  } catch (e) {
    console.error(`No se encontró el boletín con slug: ${slug}`, e);
    return null;
  }
}
