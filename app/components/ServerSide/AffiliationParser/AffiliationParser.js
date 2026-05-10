/* Next */
import Link from "next/link";

/* lib */
import dateBuilder from "@/lib/utils/dateBuilder";

/* Styles */
import styles from "./styles.module.css";

/**
 * Render a hierarchical affiliation tree based on ids concatenated with underscores.
 *
 * Root nodes are affiliations whose ids do not have a parent prefix in the current
 * dataset. Child nodes are attached to the longest matching parent id.
 *
 * @param {{ affiliations?: Affiliation[] }} props - Component props.
 * @returns {import("react").JSX.Element | null} Tree markup or null when no affiliations are provided.
 */
export default function AffiliationParser({ affiliations }) {
  if (!affiliations || affiliations.length === 0) {
    return null;
  }

  const affiliationPaths = {
    group: "group",
    department: "department",
    faculty: "faculty",
    institution: "institution",
  };

  const getPath = (affiliation) => {
    const type = affiliation?.types?.[0]?.type;
    return affiliationPaths[type] ?? affiliationPaths.institution;
  };

  const getYearsLabel = (affiliation) => {
    const { start_date, years } = affiliation;

    const hasValidStart = typeof start_date === "number" && start_date !== -1;

    const hasYears = Array.isArray(years) && years.length > 0;

    let startYear = null;
    let endLabel = null;

    if (hasValidStart) {
      startYear = new Date(start_date * 1000).getFullYear();
    } else if (hasYears) {
      startYear = Math.min(...years);
    } else {
      return null;
    }

    if (hasYears) {
      const maxYear = Math.max(...years);
      const currentYear = new Date().getFullYear();

      endLabel = maxYear === currentYear ? "Presente" : maxYear;
    } else {
      endLabel = "desconocido";
    }

    return `${startYear} - ${endLabel}`;
  };

  const getTooltip = (affiliation) => {
    const { start_date } = affiliation;

    if (!start_date || start_date === -1) return null;

    return `Fecha de inicio: ${dateBuilder(start_date)}`;
  };

  const nodeMap = new Map();
  const existingIds = new Set();

  affiliations.forEach((aff) => {
    if (!aff?.id) return;
    existingIds.add(aff.id);
    nodeMap.set(aff.id, {
      key: aff.id,
      affiliation: aff,
      children: [],
    });
  });

  const findParentId = (id) => {
    if (!id.includes("_")) return null;

    let parentId = null;

    existingIds.forEach((candidateId) => {
      if (
        id !== candidateId &&
        id.startsWith(`${candidateId}_`) &&
        (!parentId || candidateId.length > parentId.length)
      ) {
        parentId = candidateId;
      }
    });

    return parentId;
  };

  const roots = [];

  affiliations.forEach((aff) => {
    if (!aff?.id) return;

    const node = nodeMap.get(aff.id);
    if (!node) return;

    const parentId = findParentId(aff.id);

    if (parentId && nodeMap.has(parentId)) {
      nodeMap.get(parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });

  function TreeNode({ node, isRoot = false }) {
    const { affiliation, children } = node;

    const isGroupAffiliation = affiliation?.types?.[0]?.type === "group";
    const yearsLabel =
      isRoot && !isGroupAffiliation ? getYearsLabel(affiliation) : null;

    const tooltipText = getTooltip(affiliation);

    return (
      <li className={styles.treeItem} title={tooltipText || undefined}>
        <div className={styles.node}>
          <Link
            className={styles.link}
            href={`/affiliation/${getPath(affiliation)}/${affiliation.id}/affiliations`}
          >
            {affiliation.name}
            {yearsLabel && (
              <span className={styles.yearsLabel}> [{yearsLabel}]</span>
            )}
          </Link>
        </div>

        {children.length > 0 && (
          <ul>
            {children.map((child) => (
              <TreeNode key={child.key} node={child} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <ul className={styles.tree}>
      {roots.map((node) => (
        <TreeNode key={node.key} node={node} isRoot />
      ))}
    </ul>
  );
}
