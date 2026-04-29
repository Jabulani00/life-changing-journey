import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { getSessionUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-auth";
import type { Membership, Transaction } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = getAdminFirestore();
  const now = new Date();

  const [membershipsSnap, usersSnap, txSnap] = await Promise.all([
    db.collection("user_memberships").limit(200).get(),
    db.collection("users").limit(500).get(),
    db
      .collection("transactions")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get(),
  ]);

  const emailMap: Record<string, string> = {};
  for (const doc of usersSnap.docs) {
    const d = doc.data();
    if (d.userId && d.email) emailMap[d.userId as string] = d.email as string;
  }

  const memberships = membershipsSnap.docs.map((doc) => {
    const m = doc.data() as Membership;
    const isExpired =
      m.status !== "active" || new Date(m.endAt) < now;
    return { ...m, email: emailMap[m.userId] ?? null, isExpired };
  });

  const transactions = txSnap.docs.map((doc) => doc.data() as Transaction);

  const activeMembers = memberships.filter((m) => !m.isExpired).length;
  const totalRevenue = transactions
    .filter((t) => t.status === "success" && t.gateway !== "manual")
    .reduce((sum, t) => sum + (t.amount ?? 0), 0);

  return NextResponse.json({
    memberships,
    transactions,
    stats: {
      totalMembers: memberships.length,
      activeMembers,
      totalTransactions: transactions.length,
      totalRevenue,
    },
  });
}
