/**
 * API helpers for admin user management in ImpactU platform.
 * Provides CRUD operations for admin users, including password reset and restore.
 * All requests include CSRF token and handle session expiration (401).
 *
 * @module lib/apis/admin.api
 */

/* utils */
import { getCookie } from "@/lib/utils/cookies";

const API = process.env.NEXT_PUBLIC_CLIENT_API;

/**
 * Obtains the CSRF token from cookies, to be used in state-changing requests.
 * Logs a warning if the token is not available.
 *
 * @returns {string} The CSRF token, or empty string if not found.
 */
function getCsrfToken() {
  const token = getCookie("csrf_access_token");

  if (!token) {
    console.warn("[CSRF] csrf_access_token not available.");
  }

  return token || "";
}

/**
 * Fetches the list of admin users.
 * Throws an error if the session is expired (401).
 *
 * @returns {Promise<Object[]>} List of admin users.
 * @throws {Error} If session expired or fetch fails.
 */
export async function getAdminUsers() {
  const response = await fetch(`${API}/app/admin/users`, {
    credentials: "include",
  });

  if (response.status === 401) {
    const err = new Error("SESSION_EXPIRED");
    err.status = 401;
    throw err;
  }

  return response.json();
}

/**
 * Creates a new admin user.
 *
 * @param {string} email - Email of the new admin user.
 * @param {Object} payload - User data to create.
 * @returns {Promise<Object>} Created user data.
 * @throws {Error} If session expired or creation fails.
 */
export async function createAdminUser(email, payload) {
  const csrf = getCsrfToken();

  const response = await fetch(
    `${API}/app/admin/users/${encodeURIComponent(email)}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrf,
      },
      body: JSON.stringify(payload),
    },
  );

  if (response.status === 401) {
    const err = new Error("SESSION_EXPIRED");
    err.status = 401;
    throw err;
  }

  if (response.status === 403) {
    const err = new Error("FORBIDDEN");
    err.status = 403;
    throw err;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || "Error al crear usuario");
  }

  return data;
}

/**
 * Updates an existing admin user.
 *
 * @param {string} email - Email of the admin user to update.
 * @param {Object} payload - Updated user data.
 * @returns {Promise<Object>} Updated user data.
 * @throws {Error} If session expired or update fails.
 */
export async function updateAdminUser(email, payload) {
  const csrf = getCsrfToken();

  const response = await fetch(
    `${API}/app/admin/users/${encodeURIComponent(email)}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrf,
      },
      body: JSON.stringify(payload),
    },
  );

  if (response.status === 401) {
    const err = new Error("SESSION_EXPIRED");
    err.status = 401;
    throw err;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || "Error al actualizar usuario");
  }

  return data;
}

/**
 * Resets the password for an admin user.
 *
 * @param {string} email - Email of the admin user.
 * @returns {Promise<Object>} Result of the password reset.
 * @throws {Error} If session expired or reset fails.
 */
export async function resetAdminUserPassword(email) {
  const csrf = getCsrfToken();

  const response = await fetch(
    `${API}/app/admin/users/${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "X-CSRF-TOKEN": csrf,
      },
    },
  );

  if (response.status === 401) {
    const err = new Error("SESSION_EXPIRED");
    err.status = 401;
    throw err;
  }

  if (!response.ok) {
    throw new Error("Error al restablecer contraseña");
  }

  return response.json();
}

/**
 * Deactivates (soft-deletes) an admin user.
 *
 * @param {string} email - Email of the admin user to deactivate.
 * @returns {Promise<Object>} Result of the deactivation.
 * @throws {Error} If session expired or deactivation fails.
 */
export async function deactivateAdminUser(email) {
  const csrf = getCsrfToken();

  const response = await fetch(
    `${API}/app/admin/users/${encodeURIComponent(email)}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRF-TOKEN": csrf,
      },
    },
  );

  if (response.status === 401) {
    const err = new Error("SESSION_EXPIRED");
    err.status = 401;
    throw err;
  }

  return response.json();
}

/**
 * Restores a previously deactivated admin user.
 *
 * @param {string} email - Email of the admin user to restore.
 * @returns {Promise<Object>} Result of the restoration.
 * @throws {Error} If session expired or restore fails.
 */
export async function restoreAdminUser(email) {
  const csrf = getCsrfToken();

  const response = await fetch(
    `${API}/app/admin/users/${encodeURIComponent(email)}/restore`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "X-CSRF-TOKEN": csrf,
      },
    },
  );

  if (response.status === 401) {
    const err = new Error("SESSION_EXPIRED");
    err.status = 401;
    throw err;
  }

  return response.json();
}
