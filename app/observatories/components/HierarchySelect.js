"use client";

/* Hooks */
import { memo, useMemo, useRef, useState } from "react";

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
  /* The list opens wider than the selector (F77): a quarter more, between 480 and 720 px, never wider than the window. */
  const box = useRef(null);
  const [listWidth, setListWidth] = useState(false);
  const onOpen = (open) => {
    if (open && box.current) setListWidth(Math.round(Math.min(720, Math.max(480, box.current.offsetWidth * 1.25), window.innerWidth - 32)));
  };
  return (
    <div ref={box}>
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
      popupMatchSelectWidth={listWidth}
      onOpenChange={onOpen}
      treeNodeLabelProp="label"
      value={value || undefined}
      onChange={onChange}
      {...rest}
    />
    </div>
  );
});
