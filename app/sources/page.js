/* Styles */
import styles from "./styles.module.css";

/* Components */
import HeroSection from "./HeroSection";
import HighlightsSection from "./HighlightsSection";
import FiltersSection from "./FiltersSection";
import SourceTypesSection from "./SourceTypesSection";
import TopJournalsSection from "./TopJournalsSection";

/* Utils */
import getData from "@/lib/apis/server.api";

export default async function SourcesPage() {
  const filterResult = await getData(`/app/search/sources/filters`);
  const filterData = filterResult?.data ?? null;
  const journalsResult = await getData(
    `/app/search/sources?source_types=journal&max=4&page=1&sort=products_desc`,
  );
  const journalsData = journalsResult?.data ?? null;

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
