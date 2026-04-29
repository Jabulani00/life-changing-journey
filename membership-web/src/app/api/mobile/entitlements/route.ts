import { NextResponse } from "next/server";
import { mapPlanToEntitlements } from "@/lib/entitlements";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase-admin";
import type { Membership } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const db = getAdminFirestore();
  const snap = await db.collection("user_memberships").doc(uid).get();
  const membership = snap.exists ? (snap.data() as Membership) : null;

  const now = new Date();
  const isExpired =
    !membership ||
    membership.status !== "active" ||
    new Date(membership.endAt) < now;

  const activePlan = !isExpired ? membership!.planId : undefined;

  return NextResponse.json({
    userId: uid,
    membership: membership ? { ...membership, isExpired } : null,
    entitlements: mapPlanToEntitlements(activePlan),
  });
}
