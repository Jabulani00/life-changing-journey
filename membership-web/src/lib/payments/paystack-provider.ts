import type { CheckoutInput, CheckoutResult, PaymentProvider } from "@/lib/payments/provider";

function appBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set.");
  return key;
}

export class PaystackProvider implements PaymentProvider {
  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
    const secretKey = getSecretKey();
    const base = appBaseUrl();
    const reference = `lcj_${input.userId.slice(0, 8)}_${Date.now()}`;
    const amountKobo = Math.round(input.amount * 100);

    const body = {
      email: input.email ?? "",
      amount: amountKobo,
      reference,
      currency: input.currency,
      callback_url: `${base}/checkout/success`,
      metadata: {
        userId: input.userId,
        planId: input.planId,
        memberType: input.memberType,
      },
    };

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Paystack initialize failed: ${text}`);
    }

    const data = (await response.json()) as {
      status: boolean;
      data: { reference: string; authorization_url: string };
    };

    return {
      sessionId: data.data.reference,
      status: "pending",
      externalRef: data.data.reference,
      checkoutUrl: data.data.authorization_url,
    };
  }

  async verifyPayment(reference: string): Promise<Omit<CheckoutResult, "sessionId">> {
    const secretKey = getSecretKey();

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });

    if (!response.ok) {
      return { status: "failed", externalRef: reference };
    }

    const data = (await response.json()) as { data: { status: string } };
    const ps = data.data.status;
    const status: CheckoutResult["status"] =
      ps === "success" ? "success" : ps === "pending" ? "pending" : "failed";

    return { status, externalRef: reference };
  }
}

export const paystackProvider = new PaystackProvider();
