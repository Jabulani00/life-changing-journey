import { randomUUID } from "node:crypto";
import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { MemberType, Membership, PlanId, Transaction } from "@/lib/types";

export async function getMembership(userId: string) {
  const snapshot = await getDoc(doc(firestore, "user_memberships", userId));
  if (!snapshot.exists()) return null;
  return snapshot.data() as Membership;
}

export async function saveSuccessfulMembership(input: {
  userId: string;
  email: string;
  planId: PlanId;
  memberType: MemberType;
  amount: number;
  currency: string;
  externalRef: string;
  status: "success" | "pending" | "failed";
}) {
  const now = new Date();
  const endAt = new Date(now);
  endAt.setMonth(endAt.getMonth() + 1);

  const membershipId = randomUUID();
  const membership: Membership = {
    id: membershipId,
    userId: input.userId,
    planId: input.planId,
    memberType: input.memberType,
    status: input.status === "success" ? "active" : input.status,
    startAt: now.toISOString(),
    endAt: endAt.toISOString(),
    source: "web",
    createdAt: now.toISOString(),
  };

  const tx: Transaction = {
    id: randomUUID(),
    userId: input.userId,
    membershipId,
    planId: input.planId,
    memberType: input.memberType,
    amount: input.amount,
    currency: input.currency,
    status: input.status,
    gateway: "mock",
    externalRef: input.externalRef,
    createdAt: now.toISOString(),
  };

  await setDoc(doc(firestore, "user_memberships", input.userId), membership);
  await setDoc(doc(firestore, "users", input.userId), {
    userId: input.userId,
    email: input.email,
    updatedAt: now.toISOString(),
  });
  await addDoc(collection(firestore, "transactions"), {
    ...tx,
    updatedAt: now.toISOString(),
    serverCreatedAt: serverTimestamp(),
  });

  return { membership, transaction: tx };
}

export async function getRecentTransactions(userId: string): Promise<Transaction[]> {
  const q = query(
    collection(firestore, "transactions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(10)
  );
  const snapshots = await getDocs(q);
  return snapshots.docs.map((item) => item.data() as Transaction);
}
