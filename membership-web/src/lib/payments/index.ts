import { mockPaymentProvider } from "@/lib/payments/mock-provider";
import { ozowProvider } from "@/lib/payments/ozow-provider";
import { paystackProvider } from "@/lib/payments/paystack-provider";
import type { PaymentProvider } from "@/lib/payments/provider";
import { stripePaymentProvider } from "@/lib/payments/stripe-provider";

export type PaymentMode = "mock" | "stripe" | "paystack" | "ozow";

export function getPaymentMode(): PaymentMode {
  const provider = process.env.PAYMENT_PROVIDER?.toLowerCase();
  if (provider === "paystack") return "paystack";
  if (provider === "ozow") return "ozow";
  if (provider === "stripe" || process.env.STRIPE_SECRET_KEY) return "stripe";
  return "mock";
}

export function getPaymentProvider(): PaymentProvider {
  const mode = getPaymentMode();
  if (mode === "paystack") return paystackProvider;
  if (mode === "ozow") return ozowProvider;
  if (mode === "stripe") return stripePaymentProvider;
  return mockPaymentProvider;
}

export { mockPaymentProvider, stripePaymentProvider, paystackProvider, ozowProvider };
