/* Components */
import TabAlianzas from "./TabAlianzas";
import TabDatos from "./TabDatos";
import TabFuentes from "./TabFuentes";
import TabPresentacion from "./TabPresentacion";
import TabPrincipios from "./TabPrincipios";

/**
 * Array of tab objects for the About page, each containing a key, label, and component.
 */
export const tabs = [
  {
    key: "presentacion",
    label: "Presentación",
    component: TabPresentacion,
  },
  {
    key: "fuentes",
    label: "Fuentes de información y entidades",
    component: TabFuentes,
  },
  {
    key: "datos",
    label: "Nuestros datos",
    component: TabDatos,
  },
  {
    key: "alianzas",
    label: "Alianzas y proyectos",
    component: TabAlianzas,
  },
  {
    key: "principios",
    label: "Principios",
    component: TabPrincipios,
  },
];

export const tabKeys = tabs.map((tab) => tab.key);
