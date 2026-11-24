/**
 * Footer link columns.
 *
 * - Internal routes are relative, so they work in dev (dev.impactu...) and in production (impactu...).
 * - External URLs have no dev equivalent, so they are absolute and the same in both environments.
 * - `pending: true` hides a link until its page exists. Remove the flag when /privacidad and /terminos are published.
 */
export const HELP_URL = "https://help.impactu.colav.co/";
export const CONTACT_EMAIL = "grupo.colav@udea.edu.co";
// Open data catalog: it holds the ImpactU API and other Colav APIs, so it is not the same as the help.
export const OPEN_DATA_URL = "http://apis.colav.co/apidoc/index.html";

export const footerSections = [
  {
    title: "Producto",
    links: [
      { label: "Observatorios", href: "/observatories" },
      { label: "Revistas", href: "/sources" },
      {
        label: "OpenAlex Colombia",
        href: "https://openalex.colav.co/",
        external: true,
      },
      {
        label: "Repositorio OAI",
        href: "https://oai.impactu.colav.co/",
        external: true,
      },
      { label: "Métricas de calidad", href: "/metrics" },
      { label: "Boletines", href: "/newsletters" },
      { label: "Indicadores de cooperación", href: "/cooperation-dashboard" },
    ],
  },
  {
    title: "Desarrolladores",
    links: [
      { label: "Documentación", href: HELP_URL, external: true },
      {
        label: "Referencia de la API",
        href: `${HELP_URL}api-reference/introduction`,
        external: true,
      },
      { label: "Datos abiertos", href: OPEN_DATA_URL, external: true },
      { label: "Código abierto", href: "/open-source" },
      { label: "GitHub @colav", href: "https://github.com/colav", external: true },
      {
        label: "Estadísticas de uso",
        href: "https://lookerstudio.google.com/s/oHqvfOLH_e0",
        external: true,
      },
    ],
  },
  {
    title: "Organización",
    links: [
      { label: "Acerca de ImpactU", href: "/about/presentacion" },
      { label: "Fuentes y entidades", href: "/about/fuentes" },
      { label: "Nuestros datos", href: "/about/datos" },
      { label: "Alianzas y proyectos", href: "/about/alianzas" },
      { label: "Principios", href: "/about/principios" },
    ],
  },
  {
    title: "Ayuda y legal",
    links: [
      { label: "Centro de ayuda", href: HELP_URL, external: true },
      { label: "Manual de usuario", href: "/manual" },
      { label: "Contacto", href: `mailto:${CONTACT_EMAIL}`, mail: true },
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos de uso", href: "/terminos" },
    ],
  },
];
