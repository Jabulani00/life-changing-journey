import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";
import type { Membership, Transaction } from "@/lib/types";

export const runtime = "nodejs";

function sha512Lower(...parts: string[]): string {
  return createHash("sha512").update(parts.join("")).digest("hex").toLowerCase();
}

export async function POST(request: Request) {
  const privateKey = process.env.OZOW_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);

  const siteCode = params.get("SiteCode") ?? "";
  const transactionId = params.get("TransactionId") ?? "";
  const transactionRef = params.get("TransactionReference") ?? "";
  const amount = params.get("Amount") ?? "";
  const status = params.get("Status") ?? "";
  const optional1 = params.get("Optional1") ?? "";
  const optional2 = params.get("Optional2") ?? "";
  const optional3 = params.get("Optional3") ?? "";
  const optional4 = params.get("Optional4") ?? "";
  const optional5 = params.get("Optional5") ?? "";
  const receivedHash = (params.get("HashCheck") ?? "").toLowerCase();

  const expectedHash = sha512Lower(
    siteCode,
    transactionId,
    transactionRef,
    amount,
    status,
    optional1,
    optional2,
    optional3,
    optional4,
    optional5,
    privateKey
  );

  if (expectedHash !== receivedHash) {
    return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
  }

  if (status !== "Complete") {
    return NextResponse.json({ received: true });
  }

  const db = getAdminFirestore();

  try {
    const txQuery = await db
      .collection("transactions")
      .where("externalRef", "==", transactionRef)
      .limit(1)
      .get();

    if (txQuery.empty) {
      console.error("ozow webhook: no transaction found for ref", transactionRef);
      return NextResponse.json({ received: true });
    }

    const txDoc = txQuery.docs[0];
    const txData = txDoc.data() as Transaction;
    const { userId, membershipId } = txData;

    await db.runTransaction(async (txn) => {
      const memberRef = db.collection("user_memberships").doc(userId);
      const memberSnap = await txn.get(memberRef);

      if (!memberSnap.exists) return;
      const existing = memberSnap.data() as Membership;
      if (existing.id !== membershipId) return;

      const now = new Date().toISOString();
      txn.update(memberRef, { status: "active", updatedAt: now });
      txn.update(txDoc.ref, { status: "success", updatedAt: now });
      txn.set(db.collection("processed_ozow_events").doc(transactionRef), {
        transactionRef,
        processedAt: FieldValue.serverTimestamp(),
      });
    });
  } catch (err) {
    console.error("ozow webhook: persistence failed", err);
    return NextResponse.json({ error: "Persistence failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
