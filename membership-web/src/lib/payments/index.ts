import { mockPaymentProvider } from "@/lib/payments/mock-provider";
import type { PaymentProvider } from "@/lib/payments/provider";
import { stripePaymentProvider } from "@/lib/payments/stripe-provider";

export type PaymentMode = "mock" | "stripe";

export function getPaymentMode(): PaymentMode {
  if (process.env.STRIPE_SECRET_KEY) return "stripe";
  return "mock";
}

export function getPaymentProvider(): PaymentProvider {
  if (process.env.STRIPE_SECRET_KEY) {
    return stripePaymentProvider;
  }
  return mockPaymentProvider;
}

export { mockPaymentProvider, stripePaymentProvider };
