/* Components */
import NewsletterShell from "@/app/newsletters/components/NewsletterShell/NewsletterShell";
import NewsletterSidebar from "@/app/newsletters/components/NewsletterSidebar/NewsletterSidebar";
import NewsletterMarkdown from "@/app/newsletters/components/NewsletterMarkdown/NewsletterMarkdown";
/* Utilities */
import {
  getNewsletterList,
  getNewsletterBySlug,
} from "@/lib/apis/newsletter.api";
/* Styles */
import styles from "@/app/newsletters/components/NewsletterShell/styles.module.css";

export const metadata = { title: "Boletines | ImpactU" };

export default async function NewsletterPage({ searchParams }) {
  const newsletters = await getNewsletterList();

  const sorted = [...newsletters].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
  );

  const activeSlug = searchParams?.slug || sorted[0]?.slug || null;
  const newsletter = activeSlug ? await getNewsletterBySlug(activeSlug) : null;

  return (
    <NewsletterShell
      sidebar={<NewsletterSidebar items={sorted} activeSlug={activeSlug} />}
    >
      {newsletter ? (
        <NewsletterMarkdown newsletter={newsletter} />
      ) : (
        <div className={styles.emptyState}>
          <p>Selecciona un boletín para leerlo</p>
        </div>
      )}
    </NewsletterShell>
  );
}
