"use client";

/* Hooks */
import { memo, useMemo } from "react";

/* UI Library Components */
import { TreeSelect } from "antd";

const pruneCache = new WeakMap();

/**
 * Keeps in a tree the branches with products (F76 with F75): a leaf stays when its id is in `available`, a branch when some leaf
 * does; the chosen node always stays with its ancestors. Same tree, same set and same choice give the same object.
 *
 * @param {{ value: string, title: string, leafId?: number, children?: Array }[]} nodes
 * @param {Set<number>|undefined} available - Ids of the leaves with products; undefined = everything.
 * @param {string} chosen - Value of the node chosen ("" = none).
 */
export function pruneTree(nodes, available, chosen) {
  if (!available) return nodes;
  let bySet = pruneCache.get(nodes);
  if (!bySet) pruneCache.set(nodes, (bySet = new WeakMap()));
  let byChoice = bySet.get(available);
  if (!byChoice) bySet.set(available, (byChoice = new Map()));
  if (byChoice.has(chosen)) return byChoice.get(chosen);
  const walk = (list) => {
    const out = [];
    for (const n of list) {
      if (n.children) {
        const children = walk(n.children);
        if (children.length || n.value === chosen) out.push({ ...n, children });
        else if (hasChosen(n, chosen)) out.push(n);
      } else if (available.has(n.leafId) || n.value === chosen) out.push(n);
    }
    return out;
  };
  const result = walk(nodes);
  byChoice.set(chosen, result);
  return result;
}
const hasChosen = (node, chosen) => !!chosen && (node.value === chosen || (node.children || []).some((c) => hasChosen(c, chosen)));

/** Index of the nodes by value: path («Dominio › Campo › Subcampo») and the leaf ids under each node. */
export function indexTree(nodes) {
  const path = new Map();
  const leaves = new Map();
  const walk = (list, trail) => {
    for (const n of list) {
      const here = [...trail, n.title];
      path.set(n.value, here.join(" › "));
      if (n.children) {
        const ids = [];
        walk(n.children, here);
        for (const c of n.children) ids.push(...(leaves.get(c.value) || []));
        leaves.set(n.value, ids);
      } else leaves.set(n.value, [n.leafId]);
    }
  };
  walk(nodes, []);
  return { path, leaves };
}

/**
 * Select with the hierarchy (campo → subcampo → tópico, or with the domain first): any level can be chosen, the text search
 * finds nodes of any level, the list is virtual and the nodes start closed. The selector shows the path of the chosen node.
 */
export const HierarchySelect = memo(function HierarchySelect({ tree, paths, value, onChange, placeholder = "Todos", ...rest }) {
  const labelRender = useMemo(() => (node) => paths.get(node.value) || node.label, [paths]);
  return (
    <TreeSelect
      showSearch
      allowClear
      style={{ width: "100%" }}
      placeholder={placeholder}
      treeData={tree}
      fieldNames={{ label: "title", value: "value", children: "children" }}
      treeNodeFilterProp="title"
      treeDefaultExpandAll={false}
      listHeight={360}
      popupMatchSelectWidth={false}
      styles={{ popup: { root: { minWidth: 360, maxWidth: "min(720px, calc(100vw - 32px))" } } }}
      labelRender={labelRender}
      value={value || undefined}
      onChange={onChange}
      {...rest}
    />
  );
});
