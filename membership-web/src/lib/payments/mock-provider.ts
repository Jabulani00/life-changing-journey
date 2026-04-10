import { randomUUID } from "node:crypto";
import type { CheckoutInput, CheckoutResult, PaymentProvider } from "@/lib/payments/provider";

function resolveOutcome(): CheckoutResult["status"] {
  const env = process.env.MOCK_PAYMENT_OUTCOME;
  if (env === "success" || env === "pending" || env === "failed") return env;
  return "success";
}

class MockPaymentProvider implements PaymentProvider {
  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
    void input;
    const status = resolveOutcome();
    return {
      sessionId: `mock_sess_${randomUUID()}`,
      status,
      externalRef: `mock_ref_${randomUUID()}`,
    };
  }

  async verifyPayment(sessionId: string) {
    void sessionId;
    return { status: resolveOutcome(), externalRef: `mock_ref_${randomUUID()}` };
  }
}

export const mockPaymentProvider = new MockPaymentProvider();
