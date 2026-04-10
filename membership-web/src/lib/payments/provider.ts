import type { MemberType, PlanId } from "@/lib/types";

export type CheckoutInput = {
  userId: string;
  /** Used by gateways (e.g. Stripe) to prefill the payer email on hosted checkout. */
  email?: string;
  planId: PlanId;
  memberType: MemberType;
  amount: number;
  currency: string;
};

export type CheckoutResult = {
  sessionId: string;
  status: "success" | "pending" | "failed";
  externalRef: string;
  /** Present when the provider redirects the browser to a hosted checkout page. */
  checkoutUrl?: string;
};

export interface PaymentProvider {
  createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult>;
  verifyPayment(sessionId: string): Promise<Omit<CheckoutResult, "sessionId">>;
}
