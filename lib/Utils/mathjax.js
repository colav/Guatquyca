"use client";

import { useEffect } from "react";

/**
 * MathJax is a client-side functional component that loads and configures the MathJax library when the componentmounts.
 *
 * The configuration for MathJax is set on the global `window.MathJax` object. This includes:
 * - Configuration for the `tex2jax` preprocessor, including the delimiters for inline math.
 * - The configuration file to load (`MMLorHTML.js`).
 * - The input and output Jax to use (`input/TeX`, `input/MathML`, `output/HTML-CSS`).
 * - The extensions to load (`tex2jax.js`, `mml2jax.js`, `MathZoom.js`).
 * - Configuration for the TeX input Jax, including the extensions to load (`AMSmath.js`).
 * - Disabling the MathJax contextual menu.
 * - Custom CSS styles, including changing the `display` property of elements with the class `.MathJax_Display`.
 *
 * The MathJax library is loaded by creating a new script element, setting its `src` attribute to the URL of the MathJax library, and appending it to the document head. The script is loaded asynchronously.
 *
 * When the component unmounts, the script element is removed from the document head.
 *
 * This component does not render anything and does not accept any props.
 */
export default function MathJax() {
  useEffect(() => {
    window.MathJax = {
      tex2jax: {
        inlineMath: [
          ["$", "$"],
          ["\\(", "\\)"],
        ],
      },
      config: ["MMLorHTML.js"],
      jax: ["input/TeX", "input/MathML", "output/HTML-CSS"],
      extensions: ["tex2jax.js", "mml2jax.js", "MathZoom.js"],
      TeX: {
        extensions: ["AMSmath.js", "noErrors.js", "noUndefined.js"],
      },
      showMathMenu: false,
      styles: {
        "body .MathJax_Display": {
          display: "contents !important",
        },
      },
    };

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
