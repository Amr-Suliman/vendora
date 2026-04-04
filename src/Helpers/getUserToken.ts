import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getUserToken() {
  const cookieStore = await cookies();

  // On production the cookie name has __Secure- prefix
  const token =
    cookieStore.get("__Secure-next-auth.session-token")?.value ??
    cookieStore.get("next-auth.session-token")?.value;

  if (!token) return null;

  const accessToken = await decode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  return accessToken?.token ?? null;
}