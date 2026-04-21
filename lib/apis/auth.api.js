/**
 * Authentication API (Client Side)
 * --------------------------------
 * Provides login and logout functions for the ImpactU platform.
 *
 * - Login must always be performed from the browser so that httpOnly cookies (JWT + CSRF) are set and persisted.
 * - Remote logout is optional and only for explicit user action.
 * - All requests use credentials: 'include' to ensure cookies are sent.
 *
 * @module lib/apis/auth.api
 */

/* utils */
import { getCookie } from "@/lib/utils/cookies";

const API = process.env.NEXT_PUBLIC_CLIENT_API;

/**
 * Sends a login request to the API.
 *
 * The backend sets:
 *   - access_token_cookie (HttpOnly)
 *   - csrf_access_token (not HttpOnly)
 * The browser stores these cookies automatically.
 *
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authenticated user data and tokens
 * @throws {Error} If authentication fails
 */
export async function loginRequest(email, password) {
  const response = await fetch(`${API}/app/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.msg || "Error de autenticación");
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Sends a remote logout request to the API (optional).
 *
 * Only for explicit user action ("Sign out").
 * Should not be used for token expiration.
 * 401 status is acceptable if the token is already expired.
 *
 * @returns {Promise<boolean>} True if logout request was sent
 */
export async function logoutRequest() {
  const csrf = getCookie("csrf_access_token");

  try {
    const response = await fetch(`${API}/app/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRF-TOKEN": csrf,
      },
    });

    let body;
    try {
      body = await response.text();
    } catch {}

    if (!response.ok && response.status !== 401) {
      throw new Error("Error al cerrar sesión");
    }
  } catch (err) {
    console.warn("[LOGOUT] Remote logout failed:", err);
  }

  return true;
}
