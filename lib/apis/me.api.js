/**
 * Session API (Client Side)
 * -------------------------
 * Retrieves the currently authenticated user based on browser cookies.
 *
 * Used to rehydrate authentication state on page reloads
 * or direct URL navigation.
 *
 * @module lib/apis/me.api
 */

const API = process.env.NEXT_PUBLIC_CLIENT_API;

/**
 * Fetches the currently authenticated user from the active session.
 *
 * The backend determines session state based on httpOnly cookies.
 *
 * Possible responses:
 * - status: "sesion_activa"       → returns user
 * - status: "sesion_no_iniciada"  → returns null
 *
 * @returns {Promise<Object|null>} Authenticated user or null
 */
export async function getMe() {
  const response = await fetch(`${API}/app/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al consultar la sesión actual");
  }

  const data = await response.json();

  if (data.status !== "sesion_activa") {
    return null;
  }

  const { user } = data;

  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    institution: user.institution,
  };
}
