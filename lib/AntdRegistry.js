"use client";

/* React */
import React from "react";

/* Ant Design CSS in JS */
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";

/* Next.js */
import { useServerInsertedHTML } from "next/navigation";

/**
 * StyledComponentsRegistry is a function component that provides a style context for its children.
 * It uses a cache to store the styles of the components and inserts the styles into the HTML on the server side.
 * The styles are extracted from the cache and inserted into a style tag in the HTML.
 * The style tag is only inserted once to avoid duplicate CSS.
 *
 * @param {React.ReactNode} props.children - The children components to be rendered within the style context.
 *
 * @returns {JSX.Element} A StyleProvider component from the Ant Design CSS in JS library that provides a style context for its children.
 */
const StyledComponentsRegistry = ({ children }) => {
  // Create a cache to store the styles of the components
  const cache = React.useMemo(() => createCache(), []);

  // A ref to keep track of whether the styles have been inserted into the HTML on the server side
  const isServerInserted = React.useRef(false);

  // Insert the styles into the HTML on the server side
  useServerInsertedHTML(() => {
    // Avoid duplicate CSS insert
    if (isServerInserted.current) {
      return;
    }

    // Mark the styles as inserted
    isServerInserted.current = true;

    // Return a style tag with the styles extracted from the cache
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  // Provide a style context for the children components
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default StyledComponentsRegistry;
