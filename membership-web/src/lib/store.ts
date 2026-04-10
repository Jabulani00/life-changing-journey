import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { buildMembershipRecords } from "@/lib/membership-persistence";
import type { MemberType, Membership, PlanId, Transaction } from "@/lib/types";
import type { PaymentGateway } from "@/lib/types";

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
  gateway?: PaymentGateway;
}) {
  const gateway: PaymentGateway = input.gateway ?? "mock";
  const { membership, transaction: tx, now } = buildMembershipRecords({
    ...input,
    gateway,
  });

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
