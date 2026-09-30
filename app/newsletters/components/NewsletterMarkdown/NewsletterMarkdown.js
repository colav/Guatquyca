/* Utilities */
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
/* Styles */
import styles from "./styles.module.css";

/**
 * NewsletterMarkdown renders a single newsletter (title, date and markdown content).
 * Uses plain HTML tags instead of antd Typography.* because dot-notation
 * subcomponents break Next's RSC barrel optimizer in Server Components.
 *
 * @param {Object} newsletter
 * @param {string} newsletter.title
 * @param {string} newsletter.publishedAt - ISO date string.
 * @param {string} newsletter.content - Raw markdown returned by the API (or the local mock).
 * @returns {JSX.Element}
 */
export default function NewsletterMarkdown({ newsletter }) {
  return (
    <article className={styles.article}>
      <div className={styles.content}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
          }}
        >
          {newsletter.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
