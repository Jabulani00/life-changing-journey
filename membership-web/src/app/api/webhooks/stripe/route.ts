import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase-admin";
import { buildMembershipRecords } from "@/lib/membership-persistence";
import { getPlan } from "@/lib/plans";
import type { MemberType, PlanId } from "@/lib/types";

export const runtime = "nodejs";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
  return new Stripe(key);
}

function isMemberType(value: string): value is MemberType {
  return value === "children" || value === "adults" || value === "couples";
}

function isPlanId(value: string): value is PlanId {
  return value === "silver" || value === "gold" || value === "platinum";
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("stripe webhook: STRIPE_WEBHOOK_SECRET missing");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("stripe webhook: signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.mode !== "payment") {
    return NextResponse.json({ received: true });
  }

  const meta = session.metadata ?? {};
  const userId = meta.userId;
  const planIdRaw = meta.planId;
  const memberTypeRaw = meta.memberType;

  if (!userId || !planIdRaw || !memberTypeRaw || !isPlanId(planIdRaw) || !isMemberType(memberTypeRaw)) {
    console.error("stripe webhook: invalid metadata", { userId, planIdRaw, memberTypeRaw });
    return NextResponse.json({ received: true });
  }

  const plan = getPlan(planIdRaw);
  if (!plan) {
    console.error("stripe webhook: unknown plan", planIdRaw);
    return NextResponse.json({ received: true });
  }

  const expectedMinor = Math.round(plan.prices[memberTypeRaw] * 100);
  const paidMinor = session.amount_total ?? 0;
  if (paidMinor !== expectedMinor) {
    console.error("stripe webhook: amount mismatch", { expectedMinor, paidMinor, sessionId: session.id });
    return NextResponse.json({ received: true });
  }

  let email = session.customer_details?.email ?? session.customer_email ?? null;
  if (!email) {
    try {
      const user = await getAdminAuth().getUser(userId);
      email = user.email ?? null;
    } catch {
      email = null;
    }
  }
  if (!email) {
    console.error("stripe webhook: could not resolve email for user", userId);
    return NextResponse.json({ received: true });
  }

  const currency = (meta.currency ?? plan.currency).toUpperCase();
  const db = getAdminFirestore();

  try {
    await db.runTransaction(async (txn) => {
      const evRef = db.collection("processed_stripe_events").doc(event.id);
      const evSnap = await txn.get(evRef);
      if (evSnap.exists) return;

      const { membership, transaction: tx, now } = buildMembershipRecords({
        userId,
        email,
        planId: planIdRaw,
        memberType: memberTypeRaw,
        amount: plan.prices[memberTypeRaw],
        currency,
        externalRef: session.id,
        status: "success",
        gateway: "stripe",
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
        type: event.type,
        sessionId: session.id,
        processedAt: FieldValue.serverTimestamp(),
      });
    });
  } catch (err) {
    console.error("stripe webhook: persistence failed", err);
    return NextResponse.json({ error: "Persistence failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
