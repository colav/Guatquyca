import React from "react";

/* Icons */
import NewsIcon from "@/public/media/newsIcon";
import { CalendarOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* Utils */
import dateBuilder from "@/lib/Utils/dateBuilder";

/**
 * News item component that displays a single news article with title, publication date, and media source.
 *
 * @component
 * @param {Object} props.item - The news item data object
 * @param {string} props.item.url - The URL link to the full news article
 * @param {string} props.item.url_title - The title/headline of the news article
 * @param {string} props.item.url_date - The publication date of the article (ISO format expected)
 * @param {string} props.item.medium - The name of the media source/publication
 *
 * @returns {JSX.Element} A list item containing the formatted news article information
 *
 * @example
 * // Basic usage
 * const newsItem = {
 *   id: 1,
 *   url: "https://example.com/news/article",
 *   url_title: "Breaking News: Important Discovery",
 *   url_date: "2024-07-30T10:00:00Z",
 *   medium: "Science Journal"
 * };
 *
 * <NewItem item={newsItem} />
 *
 */
export default function NewItem({ item }) {
  return (
    <>
      <li key={item.id} className={styles.new_item}>
        <div className={styles.new_container}>
          <div className={styles.new_title}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.url_title}
            </a>
          </div>
          <div className={styles.newsInfo_container}>
            <div className={styles.margin_5}>
              {React.createElement(CalendarOutlined)} Publicado:{" "}
              {dateBuilder(item.url_date, "iso")}
            </div>
            <NewsIcon /> Medio: {item.medium}
          </div>
        </div>
      </li>
    </>
  );
}
