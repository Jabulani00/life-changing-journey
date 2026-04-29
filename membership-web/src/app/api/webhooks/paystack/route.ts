import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";
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
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const data = event.data;
  const reference = data.reference as string;
  const meta = (data.metadata ?? {}) as Record<string, string>;
  const userId = meta.userId;
  const planIdRaw = meta.planId;
  const memberTypeRaw = meta.memberType;

  if (!userId || !planIdRaw || !memberTypeRaw || !isPlanId(planIdRaw) || !isMemberType(memberTypeRaw)) {
    console.error("paystack webhook: invalid metadata", { userId, planIdRaw, memberTypeRaw });
    return NextResponse.json({ received: true });
  }

  const db = getAdminFirestore();

  try {
    await db.runTransaction(async (txn) => {
      const evRef = db.collection("processed_paystack_events").doc(reference);
      const evSnap = await txn.get(evRef);
      if (evSnap.exists) return;

      const amountKobo = (data.amount as number) ?? 0;
      const amount = amountKobo / 100;
      const currency = ((data.currency as string) ?? "ZAR").toUpperCase();

      let email = (data.customer as Record<string, string>)?.email ?? null;
      if (!email) {
        const userDoc = await db.collection("users").doc(userId).get();
        email = (userDoc.data()?.email as string) ?? null;
      }
      if (!email) {
        console.error("paystack webhook: could not resolve email for user", userId);
        return;
      }

      const { membership, transaction: tx, now } = buildMembershipRecords({
        userId,
        email,
        planId: planIdRaw,
        memberType: memberTypeRaw,
        amount,
        currency,
        externalRef: reference,
        status: "success",
        gateway: "paystack",
        durationMonths: 12,
      });

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
      txn.set(evRef, {
        event: event.event,
        reference,
        processedAt: FieldValue.serverTimestamp(),
      });
    });
  } catch (err) {
    console.error("paystack webhook: persistence failed", err);
    return NextResponse.json({ error: "Persistence failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
