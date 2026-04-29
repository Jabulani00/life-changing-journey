import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { getSessionUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-auth";
import { buildMembershipRecords } from "@/lib/membership-persistence";
import type { MemberType, PlanId } from "@/lib/types";

export const runtime = "nodejs";

function isMemberType(v: string): v is MemberType {
  return v === "children" || v === "adults" || v === "couples";
}

function isPlanId(v: string): v is PlanId {
  return v === "silver" || v === "gold" || v === "platinum";
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    userId?: string;
    email?: string;
    planId?: string;
    memberType?: string;
    durationMonths?: number;
  } | null;

  const { userId, email, planId, memberType, durationMonths } = body ?? {};

  if (!userId || !email || !planId || !memberType) {
    return NextResponse.json({ error: "userId, email, planId, and memberType are required." }, { status: 400 });
  }
  if (!isPlanId(planId)) {
    return NextResponse.json({ error: "Invalid planId." }, { status: 400 });
  }
  if (!isMemberType(memberType)) {
    return NextResponse.json({ error: "Invalid memberType." }, { status: 400 });
  }
  const months =
    typeof durationMonths === "number" && durationMonths >= 1 && durationMonths <= 120
      ? durationMonths
      : 1;

  const { membership, transaction: tx, now } = buildMembershipRecords({
    userId,
    email,
    planId,
    memberType,
    amount: 0,
    currency: "ZAR",
    externalRef: `manual_${userId}_${Date.now()}`,
    status: "success",
    gateway: "manual",
    durationMonths: months,
  });

  const db = getAdminFirestore();
  await db.runTransaction(async (txn) => {
    txn.set(db.collection("user_memberships").doc(userId), membership);
    txn.set(
      db.collection("users").doc(userId),
      { userId, email, updatedAt: now.toISOString() },
      { merge: true }
    );
    const txRef = db.collection("transactions").doc();
    txn.set(txRef, {
      ...tx,
      updatedAt: now.toISOString(),
      serverCreatedAt: FieldValue.serverTimestamp(),
    });
  });

  return NextResponse.json({ membership, transaction: tx });
}
