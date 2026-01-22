/**
 * Auth API (CLIENT SIDE)
 * ----------------------
 * - Login debe hacerse SIEMPRE desde el navegador para que el browser
 *   reciba y persista las cookies httpOnly (JWT + CSRF).
 * - Logout remoto es opcional y SOLO para acción explícita del usuario.
 */

import { getCookie } from "@/lib/utils/cookies";

const API = process.env.NEXT_PUBLIC_CLIENT_API;

/**
 * LOGIN
 * -----
 * - El backend setea:
 *   - access_token_cookie (HttpOnly)
 *   - csrf_access_token (NO HttpOnly)
 * - El navegador las guarda automáticamente
 */
export async function loginRequest(email, password) {
  console.log("[loginRequest] called:", email);

  const response = await fetch(`${API}/app/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  console.log("[loginRequest] response status:", response.status);
  console.log("[loginRequest] response body:", data);

  if (!response.ok) {
    const error = new Error(data.msg || "Error de autenticación");
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * LOGOUT REMOTO (opcional)
 * -----------------------
 * - SOLO para click explícito "Cerrar sesión"
 * - NO usar para expiración de token
 * - 401 es aceptable
 */
export async function logoutRequest() {
  console.log("[logoutRequest] called");

  const csrf = getCookie("csrf_access_token");
  console.log("[logoutRequest] csrf:", csrf);

  try {
    const response = await fetch(`${API}/app/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRF-TOKEN": csrf,
      },
    });

    console.log("[logoutRequest] response status:", response.status);

    let body;
    try {
      body = await response.text();
      console.log("[logoutRequest] response body:", body);
    } catch {
      console.log("[logoutRequest] no response body");
    }

    // 401 es válido si el token ya expiró
    if (!response.ok && response.status !== 401) {
      throw new Error("Error al cerrar sesión");
    }
  } catch (err) {
    console.warn(
      "[logoutRequest] logout remoto fallido (token inválido o expirado)",
      err,
    );
  }

  return true;
}
