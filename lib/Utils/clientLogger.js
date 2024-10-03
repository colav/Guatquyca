"use client";

import { useEffect } from "react";

export default function ClientLogger({ url }) {
  useEffect(() => {
    console.log(
      `\x1b[32m▄█╠═SSR═╣█▄\x1b[0m A server component fetched the URL: ${url}`
    );
  }, [url]);

  return null;
}
