import { randomUUID } from "node:crypto";
import type { MemberType, Membership, PaymentGateway, PlanId, Transaction } from "@/lib/types";

export type MembershipWriteInput = {
  userId: string;
  email: string;
  planId: PlanId;
  memberType: MemberType;
  amount: number;
  currency: string;
  externalRef: string;
  status: "success" | "pending" | "failed";
  gateway: PaymentGateway;
};

export function buildMembershipRecords(input: MembershipWriteInput) {
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
    gateway: input.gateway,
    externalRef: input.externalRef,
    createdAt: now.toISOString(),
  };

  return { membership, transaction: tx, now };
}
