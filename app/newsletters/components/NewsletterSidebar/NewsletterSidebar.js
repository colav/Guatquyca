/* Utilities */
import Link from "next/link";
import dayjs from "dayjs";
/* Styles */
import styles from "./styles.module.css";

/**
 * Groups a sorted (desc) list of newsletters by "Month YYYY".
 */
function groupByMonth(items) {
  const groups = [];
  let currentKey = null;

  items.forEach((item) => {
    const key = dayjs(item.publishedAt).format("MMMM YYYY");
    if (key !== currentKey) {
      groups.push({ key, items: [] });
      currentKey = key;
    }
    groups[groups.length - 1].items.push(item);
  });

  return groups;
}

/**
 * NewsletterSidebar renders the list of newsletters grouped by month,
 * each pointing to /newsletter?slug=... The active item is highlighted
 * based on activeSlug (comes from the current URL's searchParams).
 *
 * @param {Object[]} items - Newsletters, expected already sorted desc by publishedAt.
 * @param {string} activeSlug
 * @returns {JSX.Element}
 */
export default function NewsletterSidebar({ items, activeSlug }) {
  const groups = groupByMonth(items || []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarScroll}>
        <h2 className={styles.title}>Boletines</h2>

        {groups.length === 0 && (
          <p className={styles.empty}>Aún no hay boletines publicados</p>
        )}

        {groups.map((group) => (
          <div key={group.key} className={styles.group}>
            <span className={styles.groupLabel}>{group.key}</span>
            <ul className={styles.list}>
              {group.items.map((item) => {
                const isActive = item.slug === activeSlug;
                return (
                  <li key={item.slug}>
                    <Link
                      href={`/newsletters?slug=${item.slug}`}
                      className={
                        isActive
                          ? `${styles.item} ${styles.itemActive}`
                          : styles.item
                      }
                    >
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemDate}>
                        {dayjs(item.publishedAt).format("DD MMM")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
