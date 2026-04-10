import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase-admin";

const USER_COOKIE = "lcj_session";

type SessionUser = {
  id: string;
  email: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const idToken = cookieStore.get(USER_COOKIE)?.value;
  if (!idToken) return null;

  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    if (!decoded.uid || !decoded.email) return null;
    return { id: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

export async function setSessionToken(idToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(USER_COOKIE, idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionUser() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE);
}
