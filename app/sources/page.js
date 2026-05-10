/* Styles */
import styles from "./styles.module.css";

/* Components */
import HeroSection from "./HeroSection";
import HighlightsSection from "./HighlightsSection";
import FiltersSection from "./FiltersSection";
import SourceTypesSection from "./SourceTypesSection";
import TopJournalsSection from "./TopJournalsSection";

/**
 * SourcesPage Component
 *
 * Main page component for the sources explorer. This is a server component that fetches
 * filter data and top journals data from the API, then renders various sections including
 * hero, source types, featured journals, highlights, and filter information.
 *
 * @component
 * @async
 * @returns {Promise<JSX.Element>} The complete sources page with all sections
 */
export default async function SourcesPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_CLIENT_API ||
    process.env.API_URL ||
    "http://localhost:8080";

  async function safeFetch(path) {
    try {
      const res = await fetch(`${API_BASE}${path}`, { cache: "force-cache" });
      if (!res.ok) {
        console.error(`Fetch ${path} failed:`, res.status, res.statusText);
        return null;
      }
      const json = await res.json();
      return json?.data ?? json;
    } catch (err) {
      console.error(`Failed to fetch ${path}:`, err);
      return null;
    }
  }

  const filterData = await safeFetch(`/app/search/sources/filters`);
  const journalsData = await safeFetch(
    `/app/search/sources?source_types=journal&max=4&page=1&sort=products_desc`,
  );

  return (
    <div className={styles.page}>
      {filterData && <HeroSection data={filterData} />}

      {filterData && <SourceTypesSection data={filterData} />}

      {journalsData && <TopJournalsSection data={journalsData} />}

      <HighlightsSection />

      <FiltersSection />
    </div>
  );
}
