"use client";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "../styles.module.css";

/* Constants */
import {
  STEP_LABELS,
  STEP_TITLES,
  BREADCRUMB_ROOT,
  BREADCRUMB_NEW_ITEM,
} from "../lib/constants";

/* UI Library Components */
import { Breadcrumb, Steps, Typography } from "antd";

const { Text } = Typography;

const STEPS_ITEMS = STEP_LABELS.map((title) => ({ title }));

/**
 * FlowHeader renders the shared top section for every screen of the Theme
 * Curation flow: a breadcrumb, a step-specific H1, an optional subtitle,
 * and the Steps progress indicator. Mirrors the structure shown in the
 * original mockups, which repeat this same header shape
 * across screens with only the title/subtitle/breadcrumb tail changing.
 *
 * @param {number} current - Current step index (0-based).
 * @param {ReactNode} [subtitle] - Optional subtitle line under the H1.
 * @returns {JSX.Element}
 */
export default function FlowHeader({ current, subtitle }) {
  const rootCrumb = {
    title: <Link href="/theme-curation">{BREADCRUMB_ROOT}</Link>,
  };

  const items =
    current === 0
      ? [rootCrumb, { title: BREADCRUMB_NEW_ITEM }]
      : [
          rootCrumb,
          { title: BREADCRUMB_NEW_ITEM },
          { title: STEP_LABELS[current] },
        ];

  return (
    <>
      <Breadcrumb items={items} className={styles.breadcrumb} />

      <h1 className={styles.headerTitle}>{STEP_TITLES[current]}</h1>
      {subtitle && (
        <p className={styles.headerDescription}>
          <Text type="secondary">{subtitle}</Text>
        </p>
      )}

      <Steps
        current={current}
        items={STEPS_ITEMS}
        className={styles.steps}
        size="small"
      />
    </>
  );
}
