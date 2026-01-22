import { getCookie } from "@/lib/utils/cookies";

const API = process.env.NEXT_PUBLIC_CLIENT_API;

/**
 * Helper para obtener el token y diagnosticar problemas de dominio
 */
function getCsrfToken() {
  const token = getCookie("csrf_access_token");

  if (!token) {
    console.error(
      "❌ [CSRF] No se encontró la cookie en document.cookie.\n" +
        "Posible causa: La cookie pertenece al subdominio 'api.dev...' " +
        "y el frontend está en otro subdominio. JavaScript no tiene acceso por seguridad de dominio.",
    );
  } else {
    console.log("✅ [CSRF] Token recuperado correctamente:", token);
  }

  return token;
}

export async function getAdminUsers() {
  console.log("[getAdminUsers] Solicitando a:", `${API}/app/admin/users`);
  const response = await fetch(`${API}/app/admin/users`, {
    credentials: "include",
  });

  if (response.status === 401) {
    const err = new Error("SESSION_EXPIRED");
    err.status = 401;
    throw err;
  }

  return await response.json();
}

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

  const data = await response.json();
  if (!response.ok) throw new Error(data.msg || "Error al crear usuario");
  return data;
}

export async function updateAdminUser(email, payload) {
  const csrf = getCsrfToken();

  const response = await fetch(
    `${API}/app/admin/users/${encodeURIComponent(email)}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrf || "",
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
  if (!response.ok) throw new Error(data.msg || "Error al actualizar usuario");
  return data;
}

export async function resetAdminUserPassword(email) {
  const csrf = getCsrfToken();

  const response = await fetch(
    `${API}/app/admin/users/${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "X-CSRF-TOKEN": csrf || "",
      },
    },
  );

  if (response.status === 401) {
    const err = new Error("SESSION_EXPIRED");
    err.status = 401;
    throw err;
  }

  if (!response.ok) throw new Error("Error al restablecer contraseña");
  return await response.json();
}

export async function deactivateAdminUser(email) {
  const csrf = getCsrfToken();

  const response = await fetch(
    `${API}/app/admin/users/${encodeURIComponent(email)}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRF-TOKEN": csrf || "",
      },
    },
  );

  if (response.status === 401) {
    const err = new Error("SESSION_EXPIRED");
    err.status = 401;
    throw err;
  }

  return await response.json();
}

export async function restoreAdminUser(email) {
  const csrf = getCsrfToken();

  const response = await fetch(
    `${API}/app/admin/users/${encodeURIComponent(email)}/restore`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRF-TOKEN": csrf || "",
      },
    },
  );

  if (response.status === 401) {
    const err = new Error("SESSION_EXPIRED");
    err.status = 401;
    throw err;
  }

  return await response.json();
}
