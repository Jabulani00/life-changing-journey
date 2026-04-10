import Stripe from "stripe";
import type { CheckoutInput, CheckoutResult, PaymentProvider } from "@/lib/payments/provider";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }
  return new Stripe(key);
}

function appBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

export class StripePaymentProvider implements PaymentProvider {
  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
    const stripe = getStripe();
    const base = appBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${base}/dashboard?checkout=success`,
      cancel_url: `${base}/plans?checkout=cancelled`,
      client_reference_id: input.userId,
      ...(input.email ? { customer_email: input.email } : {}),
      metadata: {
        userId: input.userId,
        planId: input.planId,
        memberType: input.memberType,
        currency: input.currency,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: input.currency.toLowerCase(),
            unit_amount: Math.round(input.amount * 100),
            product_data: {
              name: `Membership — ${input.planId} (${input.memberType})`,
            },
          },
        },
      ],
    });

    return {
      sessionId: session.id,
      status: "pending",
      externalRef: session.id,
      checkoutUrl: session.url ?? undefined,
    };
  }

  async verifyPayment(sessionId: string) {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    return {
      status: paid ? ("success" as const) : session.payment_status === "unpaid" ? ("pending" as const) : ("failed" as const),
      externalRef: session.id,
    };
  }
}

export const stripePaymentProvider = new StripePaymentProvider();
