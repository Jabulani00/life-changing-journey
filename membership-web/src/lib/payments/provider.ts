import type { MemberType, PlanId } from "@/lib/types";

export type CheckoutInput = {
  userId: string;
  planId: PlanId;
  memberType: MemberType;
  amount: number;
  currency: string;
};

export type CheckoutResult = {
  sessionId: string;
  status: "success" | "pending" | "failed";
  externalRef: string;
};

export interface PaymentProvider {
  createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult>;
  verifyPayment(sessionId: string): Promise<Omit<CheckoutResult, "sessionId">>;
}
