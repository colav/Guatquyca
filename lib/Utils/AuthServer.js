import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getUserFromServerCookie() {
  const token = cookies().get("impactu_session")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.sub,
      role: payload.rol,
      institution: payload.institution,
    };
  } catch (error) {
    console.error("Error validando sesión:", error.message);
    return null;
  }
}
