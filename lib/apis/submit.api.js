/* utils */
import { getCookie } from "@/lib/utils/cookies";

const API = process.env.NEXT_PUBLIC_CLIENT_API;

function getCsrfToken() {
  return getCookie("csrf_access_token") || "";
}

const ENDPOINTS = {
  staff: "/app/submit/staff",
  scienti: "/app/submit/scienti",
  ciarp: "/app/submit/ciarp",
};

export async function submitFile({ type, file }) {
  const csrf = getCsrfToken();

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API}${ENDPOINTS[type]}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF-TOKEN": csrf,
    },
    body: formData,
  });

  if (response.status === 401) {
    const err = new Error("SESSION_EXPIRED");
    err.status = 401;
    throw err;
  }

  const raw = await response.json();

  const normalized = {
    success: raw.success,
    errors: raw.errors ?? 0,
    duplicates: raw.duplicates ?? 0,
    warnings: raw.warnings ?? 0,
    pdf_Base64: raw.pdf_Base64 ?? null,
    fileMessage: raw.fileMessage ?? null,
  };

  if (!response.ok) {
    throw normalized;
  }

  return normalized;
}
