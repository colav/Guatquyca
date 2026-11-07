"use client";

/* Hooks */
import { memo, useMemo } from "react";

/* UI Library Components */
import { TreeSelect } from "antd";

import { indexTree, pruneTree } from "@/lib/observatories/hierarchyTree";

export { indexTree, pruneTree };

/**
 * Select with the hierarchy (campo → subcampo → tópico, or with the domain first): any level can be chosen, the text search
 * finds nodes of any level, the list is virtual and the nodes start closed. The selector shows the path of the chosen node.
 */
export const HierarchySelect = memo(function HierarchySelect({ tree, paths, value, onChange, placeholder = "Todos", ...rest }) {
  /* The selector shows the path of the node chosen (rc-tree-select 5.27 has no labelRender): each node carries it as `label`. */
  const data = useMemo(() => {
    const withPath = (list) => list.map((n) => ({ ...n, label: paths.get(n.value) || n.title, children: n.children ? withPath(n.children) : undefined }));
    return withPath(tree);
  }, [tree, paths]);
  return (
    <TreeSelect
      showSearch
      allowClear
      style={{ width: "100%" }}
      placeholder={placeholder}
      treeData={data}
      fieldNames={{ label: "title", value: "value", children: "children" }}
      treeNodeFilterProp="title"
      treeDefaultExpandAll={false}
      listHeight={360}
      popupMatchSelectWidth={false}
      styles={{ popup: { root: { minWidth: 360, maxWidth: "min(720px, calc(100vw - 32px))" } } }}
      treeNodeLabelProp="label"
      value={value || undefined}
      onChange={onChange}
      {...rest}
    />
  );
});
