import { mockPaymentProvider } from "@/lib/payments/mock-provider";
import { paystackProvider } from "@/lib/payments/paystack-provider";
import type { PaymentProvider } from "@/lib/payments/provider";

export type PaymentMode = "mock" | "paystack";

export function getPaymentMode(): PaymentMode {
  const provider = process.env.PAYMENT_PROVIDER?.toLowerCase();
  if (provider === "paystack") return "paystack";
  return "mock";
}

export function getPaymentProvider(): PaymentProvider {
  const mode = getPaymentMode();
  if (mode === "paystack") return paystackProvider;
  return mockPaymentProvider;
}

export { mockPaymentProvider, paystackProvider };
