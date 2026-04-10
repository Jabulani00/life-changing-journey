import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getPaymentMode, getPaymentProvider } from "@/lib/payments";
import { getPlan } from "@/lib/plans";
import { saveSuccessfulMembership } from "@/lib/store";
import type { MemberType } from "@/lib/types";

const validMemberTypes: MemberType[] = ["children", "adults", "couples"];

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    planId?: string;
    memberType?: MemberType;
  } | null;

  const planId = body?.planId;
  const memberType = body?.memberType;
  if (!planId || !memberType || !validMemberTypes.includes(memberType)) {
    return NextResponse.json({ error: "planId and memberType are required." }, { status: 400 });
  }

  const plan = getPlan(planId);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  const amount = plan.prices[memberType];
  const provider = getPaymentProvider();
  const paymentMode = getPaymentMode();

  const checkout = await provider.createCheckoutSession({
    userId: user.id,
    email: user.email,
    planId: plan.id,
    memberType,
    amount,
    currency: plan.currency,
  });

  if (checkout.checkoutUrl) {
    return NextResponse.json({
      paymentMode,
      checkout: {
        sessionId: checkout.sessionId,
        externalRef: checkout.externalRef,
        status: checkout.status,
        checkoutUrl: checkout.checkoutUrl,
      },
      message: "Complete payment on the secure checkout page. Membership activates after payment is confirmed.",
    });
  }

  const result = await saveSuccessfulMembership({
    userId: user.id,
    email: user.email,
    planId: plan.id,
    memberType,
    amount,
    currency: plan.currency,
    externalRef: checkout.externalRef,
    status: checkout.status,
    gateway: "mock",
  });

  return NextResponse.json({
    paymentMode,
    checkout,
    membership: result.membership,
    transaction: result.transaction,
    message:
      checkout.status === "success"
        ? "Membership activated with mock payment."
        : "Mock payment did not return success. Membership state updated for testing.",
  });
}
