"use client";

/* UI Library Components */
import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";

/**
 * ThemeCurationLayout wraps every route of the Theme Curation feature in an
 * Ant Design ConfigProvider with the Spanish locale, so antd's built-in
 * texts (sort tooltips, table filters, "No data", pagination) render in
 * Spanish. It is scoped to this feature on purpose: the root ConfigProvider
 * in app/layout.js defines no locale and affects all of ImpactU. The root
 * theme (colors, font) is inherited, since nested providers merge with
 * their parent.
 *
 * It is a client component because the locale object is passed to a client
 * provider.
 *
 * @param {ReactNode} children - The feature's page.
 * @returns {JSX.Element}
 */
export default function ThemeCurationLayout({ children }) {
  return <ConfigProvider locale={esES}>{children}</ConfigProvider>;
}
