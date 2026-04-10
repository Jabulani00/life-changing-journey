import { NextResponse } from "next/server";
import { setSessionToken } from "@/lib/auth";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { idToken?: string } | null;
  const idToken = body?.idToken;

  if (!idToken) {
    return NextResponse.json({ error: "idToken is required." }, { status: 400 });
  }

  try {
    await getAdminAuth().verifyIdToken(idToken);
    await setSessionToken(idToken);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid Firebase token." }, { status: 401 });
  }
}
