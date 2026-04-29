import { createHash } from "node:crypto";
import type { CheckoutInput, CheckoutResult, PaymentProvider } from "@/lib/payments/provider";

function appBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

function getEnv() {
  const siteCode = process.env.OZOW_SITE_CODE;
  const privateKey = process.env.OZOW_PRIVATE_KEY;
  const apiKey = process.env.OZOW_API_KEY;
  if (!siteCode || !privateKey || !apiKey) {
    throw new Error("OZOW_SITE_CODE, OZOW_PRIVATE_KEY, and OZOW_API_KEY must be set.");
  }
  return { siteCode, privateKey, apiKey };
}

function sha512Lower(...parts: string[]): string {
  return createHash("sha512").update(parts.join("")).digest("hex").toLowerCase();
}

export class OzowProvider implements PaymentProvider {
  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
    const { siteCode, privateKey } = getEnv();
    const base = appBaseUrl();
    const isTest = process.env.NODE_ENV !== "production" ? "true" : "false";
    const reference = `lcj_${input.userId.slice(0, 8)}_${Date.now()}`;
    const amount = input.amount.toFixed(2);
    const countryCode = "ZA";
    const currencyCode = "ZAR";
    const bankReference = reference;
    const cancelUrl = `${base}/checkout/cancelled`;
    const errorUrl = `${base}/checkout/cancelled`;
    const successUrl = `${base}/checkout/success`;
    const notifyUrl = `${base}/api/webhooks/ozow`;

    const hashCheck = sha512Lower(
      siteCode,
      countryCode,
      currencyCode,
      amount,
      reference,
      bankReference,
      cancelUrl,
      errorUrl,
      successUrl,
      notifyUrl,
      isTest,
      privateKey
    );

    const body = new URLSearchParams({
      SiteCode: siteCode,
      CountryCode: countryCode,
      CurrencyCode: currencyCode,
      Amount: amount,
      TransactionReference: reference,
      BankReference: bankReference,
      CancelUrl: cancelUrl,
      ErrorUrl: errorUrl,
      SuccessUrl: successUrl,
      NotifyUrl: notifyUrl,
      IsTest: isTest,
      HashCheck: hashCheck,
      Optional1: input.userId,
      Optional2: input.planId,
      Optional3: input.memberType,
    });

    const response = await fetch("https://api.ozow.com/postpaymentrequest", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ozow payment request failed: ${text}`);
    }

    const data = (await response.json()) as { url?: string; paymentRequestId?: string };
    const checkoutUrl = data.url;
    if (!checkoutUrl) throw new Error("Ozow did not return a payment URL.");

    return {
      sessionId: reference,
      status: "pending",
      externalRef: reference,
      checkoutUrl,
    };
  }

  async verifyPayment(reference: string): Promise<Omit<CheckoutResult, "sessionId">> {
    const { apiKey } = getEnv();

    const response = await fetch(
      `https://api.ozow.com/gettransactionbyreference/${encodeURIComponent(reference)}`,
      { headers: { ApiKey: apiKey } }
    );

    if (!response.ok) {
      return { status: "failed", externalRef: reference };
    }

    const data = (await response.json()) as { Status?: string };
    const ozowStatus = data.Status ?? "";
    const status: CheckoutResult["status"] =
      ozowStatus === "Complete" ? "success" : ozowStatus === "Pending" ? "pending" : "failed";

    return { status, externalRef: reference };
  }
}

export const ozowProvider = new OzowProvider();
