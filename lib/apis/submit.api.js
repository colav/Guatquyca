/* utils */
import { getCookie } from "@/lib/utils/cookies";

const API = process.env.NEXT_PUBLIC_CLIENT_API;

function getCsrfToken() {
  return getCookie("csrf_access_token") || "";
}

const ENDPOINTS = {
  staff: "/app/staff",
  scienti: "/app/scienti",
  ciarp: "/app/ciarp",
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

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
