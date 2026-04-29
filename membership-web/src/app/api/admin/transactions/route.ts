import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { getSessionUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-auth";
import type { Transaction } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = getAdminFirestore();
  const snap = await db
    .collection("transactions")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  const transactions = snap.docs.map((doc) => doc.data() as Transaction);
  return NextResponse.json({ transactions });
}
